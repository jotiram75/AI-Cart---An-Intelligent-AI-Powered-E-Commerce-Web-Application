import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API Key Missing");
}
if (!GEMINI_API_KEY) {
    console.warn("Gemini API Key Missing - Analytics will be disabled");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const replicate = REPLICATE_API_TOKEN ? new Replicate({ auth: REPLICATE_API_TOKEN }) : null;

export const tryOutfit = async (req, res) => {
    try {
        console.log("[V16] SIMPLIFIED VTO PIPELINE START");
        
        const { productImageUrl, userImageBase64 } = req.body;

        if (!productImageUrl || !userImageBase64) {
            return res.status(400).json({ success: false, message: "Missing images" });
        }

        // 1. Generate Analytics with Gemini
        let analyticsData = null;
        let stylingAdvice = "LookSync AI: This outfit complements your style! (AI Analysis Unavailable)";

        if (GEMINI_API_KEY) {
            try {
                console.log("[V16] Generating Analytics with Gemini...");
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Prepare images for Gemini (assuming base64 input for user, url for product needs fetching or assuming base64 if possible)
                
                const productResp = await axios.get(productImageUrl, { responseType: 'arraybuffer' });
                const productBase64 = Buffer.from(productResp.data).toString('base64');
                
                // Cleanup user base64 header if present
                const userBase64Clean = userImageBase64.replace(/^data:image\/\w+;base64,/, "");

                const prompt = `
                Analyze these two images: 
                1. A photo of a user.
                2. A photo of a fashion product.

                Provide a detailed fashion analysis in JSON format with the following keys:
                - userAnalysis: { bodyShape: string, skinTone: string, recommendedColors: string[] }
                - productAnalysis: { style: string, occasion: string, mainColors: string[] }
                - compatibility: { score: number (0-100), reason: string }
                - stylingAdvice: string (A helpful, encouraging 2-sentence fashion tip combining the user and product)

                Do NOT use Markdown formatting. Return ONLY the raw JSON string.
                `;

                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: userBase64Clean, mimeType: "image/jpeg" } },
                    { inlineData: { data: productBase64, mimeType: "image/jpeg" } }
                ]);

                const responseText = result.response.text();
                // Clean markdown code blocks if present
                const jsonString = responseText.replace(/```json|```/g, "").trim();
                analyticsData = JSON.parse(jsonString);
                stylingAdvice = analyticsData.stylingAdvice;
                
                console.log("[V16] Analytics generated successfully!");

            } catch (geminiError) {
                console.error("[V16] Gemini Analysis Error:", geminiError.message);
                // Fallback is already set
            }
        }

        // 2. Generate VTO Image
        console.log("[V18-REPLICATE] Starting High-Fidelity VTO Pipeline...");

        let generatedImageUrl = userImageBase64;

        // --- ENGINE 1: REPLICATE (PRIMARY) ---
        if (replicate && REPLICATE_API_TOKEN) {
            try {
                console.log("[V18-REPLICATE] Using cuuupid/idm-vton on Replicate...");
                
                // Cleanup user base64 header if present
                const userBase64Clean = userImageBase64.replace(/^data:image\/\w+;base64,/, "");
                
                // Construct a highly descriptive prompt for the garment
                const garmentDescription = `A ${analyticsData?.productAnalysis?.mainColors?.join(", ") || "fashionable"} ${analyticsData?.productAnalysis?.style || "garment"} suitable for ${analyticsData?.productAnalysis?.occasion || "any occasion"}. Please transfer this exact garment onto the person in the user image, preserving the person's identity and original background.`;
                
                console.log("[V18-REPLICATE] Using optimized prompt:", garmentDescription);

                // Run the model
                const output = await replicate.run(
                    "cuuupid/idm-vton:c871bb9b0ad830786889623f198a6e40f5d412d951151bb2f4aa45c4302b5a1b",
                    {
                        input: {
                            human_img: `data:image/jpeg;base64,${userBase64Clean}`,
                            garm_img: productImageUrl,
                            garment_des: garmentDescription,
                            is_checked: true,
                            is_checked_det_lib: false,
                            mask_only: false,
                            num_inference_steps: 30
                        }
                    }
                );

                if (output && Array.isArray(output) && output.length > 0) {
                    generatedImageUrl = output[0];
                    console.log("[V18-REPLICATE] Generation successful!");
                    
                    return res.json({
                        success: true,
                        generatedImage: generatedImageUrl,
                        advice: stylingAdvice,
                        analytics: analyticsData
                    });
                } else if (output && typeof output === 'string') {
                    generatedImageUrl = output;
                     console.log("[V18-REPLICATE] Generation successful (string output)!");
                     return res.json({
                        success: true,
                        generatedImage: generatedImageUrl,
                        advice: stylingAdvice,
                        analytics: analyticsData
                    });
                }
            } catch (replicateError) {
                console.error("[V18-REPLICATE] Error:", replicateError.message);
                console.log("Falling back to Imagen/SDXL...");
            }
        }

        // --- ENGINE 2: GOOGLE IMAGEN (FALLBACK) ---
        let imagenPrompt = "";

        // Step 2a: Generate a SUPER detailed prompt using Gemini Vision
        // This acts as the "Nano Banana" style transfer brain
        try {
             console.log("[V18-BANANA] Analyzing images for creating exact prompt...");
             const promptModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
             
             // Fetch product image to base64
             const productResp = await axios.get(productImageUrl, { responseType: 'arraybuffer' });
             const productBase64 = Buffer.from(productResp.data).toString('base64');
             const userBase64Clean = userImageBase64.replace(/^data:image\/\w+;base64,/, "");

             const analysisPrompt = `
             You are an expert fashion photographer and AI prompt engineer.
             I need to generate a "Virtual Try-On" image.
             
             Input 1: User Photo.
             Input 2: Garment Photo.

             Task: Describe a new image of the USER wearing the GARMENT.
             
             CRITICAL RULES for the Description:
             1. Subject: Describe the users physical traits (Face, Hair, Body Shape, Skin Tone, Pose, Lighting in original photo) in EXTREME detail. The goal is to preserve identity.
             2. Apparel: Describe the Garment (Color, Texture, Neckline, Sleeves, Logo/Pattern) in EXTREME detail.
             3. Composition: Keep the background and lighting of the User Photo.
             4. Output: Write a single, highly detailed prompt for an image generator (like Imagen 3) that will recreate this exact scene but with the user wearing the new garment.
             5. Start the prompt with: "A photorealistic 4k image of..."
             
             Output ONLY the prompt text. Do not add any conversational text.
             `;

             const analysisResult = await promptModel.generateContent([
                 analysisPrompt,
                 { inlineData: { data: userBase64Clean, mimeType: "image/jpeg" } },
                 { inlineData: { data: productBase64, mimeType: "image/jpeg" } }
             ]);

             imagenPrompt = analysisResult.response.text().trim();
             console.log("[V18-BANANA] Generated High-Fidelity Prompt:", imagenPrompt);

        } catch (promptError) {
            console.error("[V18-BANANA] Prompt Generation Failed:", promptError.message);
            // Fallback prompt
            imagenPrompt = `A photorealistic 4k image of a person wearing a ${analyticsData?.productAnalysis?.style || 'stylish top'}. 
            The person has ${analyticsData?.userAnalysis?.skinTone || 'medium'} skin and ${analyticsData?.userAnalysis?.bodyShape || 'average'} build.
            High quality fashion photography, detailed texture, natural lighting.`;
        }

        // Step 2b: Generate Image with Imagen 3
        try {
            console.log("[V18-BANANA] Calling Imagen 3 with detailed prompt...");
            
            const imagenResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
                {
                    instances: [
                        {
                            prompt: imagenPrompt
                        }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "3:4",
                        personGeneration: "allow_adult"
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if(imagenResponse.data.predictions && imagenResponse.data.predictions.length > 0) {
                 const imageBytes = imagenResponse.data.predictions[0].bytesBase64Encoded;
                 generatedImageUrl = `data:image/jpeg;base64,${imageBytes}`;
                 console.log("[V18-BANANA] Imagen generation successful!");
            } else {
                throw new Error("No predictions returned from Imagen");
            }

        } catch (imagenError) {
             console.error("[V18-BANANA] Imagen Error:", imagenError.response?.data || imagenError.message);
             console.log("Falling back to Stable Diffusion...");
             
             // Fallback to SD if Imagen fails (e.g. quota or region issues)
             try {
                // Using SDXL as a high-quality fallback
                const sdResponse = await axios.post(
                    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                    {
                        inputs: imagenPrompt,
                        options: { wait_for_model: true, use_cache: false }
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        responseType: 'arraybuffer',
                        timeout: 90000
                    }
                );
                const imageBase64 = Buffer.from(sdResponse.data).toString('base64');
                generatedImageUrl = `data:image/jpeg;base64,${imageBase64}`;
                console.log("[V18-BANANA] Fallback SDXL generation successful!");
             } catch(sdError) {
                 console.error("[V18-BANANA] Fallback SDXL Error:", sdError.message);
                 if(sdError.response?.status === 410 || sdError.response?.status === 404) {
                    console.log("[V18-BANANA] SDXL unavailable, trying Turbo...");
                    try {
                        const turboResponse = await axios.post(
                        "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
                        {
                            inputs: imagenPrompt,
                            options: { wait_for_model: true, use_cache: false }
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
                                "Content-Type": "application/json"
                            },
                        responseType: 'arraybuffer',
                        timeout: 90000
                    }
                );
                const imageBase64 = Buffer.from(turboResponse.data).toString('base64');
                generatedImageUrl = `data:image/jpeg;base64,${imageBase64}`;
                console.log("[V18-BANANA] Final Fallback SDXL-Turbo successful!");
                    } catch (turboError) {
                        console.error("[V18-BANANA] All VTO attempts failed.");
                    }
                 }
             }
        }

        res.json({
            success: true,
            generatedImage: generatedImageUrl,
            advice: stylingAdvice,
            analytics: analyticsData
        });

    } catch (error) {
        console.error("[V16] Critical controller error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

import ChatQuery from "../model/ChatQuery.js";

// ... existing imports ...

export const chatWithAI = async (req, res) => {
    try {
        console.log("[V19-FLASH-LATEST] chatWithAI called - Using gemini-flash-latest");
        const { message, productContext } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // 1. Check Cache
        const contextType = productContext ? "product" : "global";
        const productName = productContext?.name?.trim().toLowerCase() || null;
        const normalizedQuery = message.trim().toLowerCase();

        const cachedQuery = await ChatQuery.findOne({
            query: normalizedQuery,
            contextType: contextType,
            productName: productName
        });

        if (cachedQuery) {
            console.log("[CACHE HIT] Returning cached response for:", normalizedQuery);
            
            // Async update hits and lastAccessed
            cachedQuery.hits += 1;
            cachedQuery.lastAccessed = Date.now();
            await cachedQuery.save();

            return res.json({ success: true, response: cachedQuery.response });
        }

        console.log("[CACHE MISS] Querying Gemini...");

        if (!GEMINI_API_KEY) {
            console.error("[V16] GEMINI_API_KEY is missing in chatWithAI");
            return res.status(503).json({ success: false, message: "AI Service Unavailable (Missing Key)" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        let systemInstruction = "";

        if (productContext) {
            console.log("Using Product Context:", productContext.name);
            // Safe access to fields
            const pName = productContext.name || "Unknown Product";
            const pCat = productContext.category || "General";
            const pSub = productContext.subCategory || "General";
            const pPrice = productContext.price || "N/A";
            const pDesc = productContext.description || "No description available.";
            const pSizes = Array.isArray(productContext.sizes) ? productContext.sizes.join(", ") : (productContext.sizes || "N/A");

            // Product Specific Mode
            systemInstruction = `
            You are a helpful and enthusiastic sales assistant for an e-commerce store called 'AICart'.
            You are currently helping a customer looking at a specific product.
            
            Product Details:
            Name: ${pName}
            Category: ${pCat}
            Sub-Category: ${pSub}
            Price: ${pPrice}
            Description: ${pDesc}
            Sizes: ${pSizes}

            Your Goal: Answer the customer's questions *specifically* about this product. 
            - Be concise (max 2-3 sentences).
            - Highlight key features mentioned in the description.
            - If asked about price, mention it.
            - If asked about something not in the details, say you don't have that info but it looks like a great product.
            - Tone: Professional, friendly, and persuasive.
            `;
        } else {
            console.log("Using Global Context");
            // Global Store Mode
            systemInstruction = `
            You are a friendly customer support AI for 'AICart', a modern e-commerce fashion store.
            Your Goal: Help users navigate the site, find general information, or feel welcome.
            
            - Store Name: AICart
            - Policies: We offer 7-day returns, free global shipping, and cash on delivery.
            - Navigation: We have Home, Collection, About, and Contact pages.
            
            - Be concise (max 2 sentences).
            - If asked about specific order status, ask them to check their 'Orders' page.
            - Tone: Helpful, polite, and brief.
            `;
        }

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist the customer with AICart queries." }]
                }
            ]
        });

        console.log("Sending message to Gemini...");
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();
        console.log("Gemini response received (length):", responseText.length);

        // 2. Save to Cache
        try {
            await ChatQuery.create({
                query: normalizedQuery,
                response: responseText,
                contextType: contextType,
                productName: productName
            });
            console.log("[CACHE SAVE] Saved new query/response to cache.");
        } catch (cacheError) {
            console.error("[CACHE ERROR] Failed to save to cache:", cacheError.message);
            // Non-blocking error, continue to respond
        }

        res.json({ success: true, response: responseText });

    } catch (error) {
        console.error("[V16] Chat Controller Error:", error); // Log full error object
        res.status(500).json({ success: false, message: "AI Error: " + error.message });
    }
};

export const getSuggestedQuestions = async (req, res) => {
    try {
        // If no API key, return static defaults
        if (!GEMINI_API_KEY) {
            return res.json({
                success: true,
                questions: ["Show me latest products", "Track my order", "What is your return policy?"]
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Generate 3 short, diverse, and relevant questions a user might ask a fashion e-commerce voice assistant.
        Examples: "Show me red dresses", "Where is my order?", "Do you have sneakers?", "What's trending?".
        
        Return ONLY a raw JSON array of strings. No markdown.
        Example: ["Question 1", "Question 2", "Question 3"]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean markdown if present
        const jsonString = responseText.replace(/```json|```/g, "").trim();
        const questions = JSON.parse(jsonString);

        res.json({ success: true, questions });

    } catch (error) {
        console.error("Suggested Questions Error:", error);
        // Fallback to defaults
        res.json({
            success: true,
            questions: ["Show me new arrivals", "Check my order status", "Contact support"]
        });
    }
};

export const checkLimit = async (req, res) => {
    try {
        // Simple health/limit check for frontend
        res.json({
            success: true,
            message: "AI Service is online",
            limitRemaining: "Unlimited" // Mock for now
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
