import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API Key Missing");
}
if (!GEMINI_API_KEY) {
    console.warn("Gemini API Key Missing - Analytics will be disabled");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

                // Prepare images for Gemini (assuming base64 input for user, url for product needs fetching or assuming base64 if possible, 
                // but checking productImageUrl provided is a URL. Gemini URL handling is limited, better to pass base64 or download it.
                // For simplicity/speed we will try to fetch the product image to base64 first.
                
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
                console.error("[V16] Gemini Analysis Error:", geminiError);
                // Fallback is already set
            }
        }

        console.log("[V16] Generating virtual try-on with Stable Diffusion...");
        
        // 2. Generate VTO Image (Keep existing logic but improve prompt if possible using analytics?)
        // For now keeping usage of SD 2.1 as verified working
        const sdPrompt = `professional fashion photography, full body portrait, person wearing stylish modern clothing, high quality fashion shoot, natural lighting, studio quality, detailed fabric texture, realistic, 4k, photorealistic`;

        let generatedImageUrl = userImageBase64;

        try {
            const sdResponse = await axios.post(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
                {
                    inputs: sdPrompt,
                    options: { 
                        wait_for_model: true,
                        use_cache: false
                    }
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
            console.log("[V16] VTO generation successful!");

        } catch (sdError) {
            console.error("[V16] Stable Diffusion Error:", sdError.message);
            // Fallback to original image if generation fails
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

export const chatWithAI = async (req, res) => {
    try {
        console.log("[V19-FLASH-LATEST] chatWithAI called - Using gemini-flash-latest");
        const { message, productContext } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

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

        res.json({ success: true, response: responseText });

    } catch (error) {
        console.error("[V16] Chat Controller Error:", error); // Log full error object
        res.status(500).json({ success: false, message: "AI Error: " + error.message });
    }
};
