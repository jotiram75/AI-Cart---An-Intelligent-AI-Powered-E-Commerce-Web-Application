const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Resizes and compresses an image base64 string using Canvas.
 */
const compressImage = (base64Str, maxWidth = 512, maxHeight = 512, quality = 0.6) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
};

/**
 * Generates a virtual try-on styling advice by calling our local backend.
 * This bypasses CORS and secures our Hugging Face API key.
 */
export const generateTryOnResult = async (productImageUrl, userImageBase64) => {
    try {
        console.log("Frontend: Checking backend health...");
        const healthRes = await fetch(`${BACKEND_URL}/api/ai/check-limit`).catch(e => ({ message: "Server Unreachable" }));
        const healthData = healthRes.json ? await healthRes.json() : healthRes;
        console.log("Frontend: Backend Health:", healthData);

        console.log("Frontend: Compressing image...");
        const compressedUserImage = await compressImage(userImageBase64);
        
        const sizeInKB = (compressedUserImage.length * 0.75 / 1024).toFixed(2);
        console.log(`Frontend: Compressed image size: ~${sizeInKB} KB`);

        console.log("Frontend: Calling backend AI service...");

        const response = await fetch(`${BACKEND_URL}/api/ai/try-on`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productImageUrl,
                userImageBase64: compressedUserImage
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Backend AI Service Error");
        }

        return {
            text: data.advice,
            imageUrl: data.generatedImage || compressedUserImage,
            analytics: data.analytics
        };

    } catch (error) {
        console.error("Frontend AI Error:", error);
        throw new Error(error.message || "Failed to connect to AI service");
    }
};
