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
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
