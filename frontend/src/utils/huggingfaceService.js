const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Resizes and compresses an image base64 string using Canvas.
 */
const compressImage = (
  base64Str,
  maxWidth = 512,
  maxHeight = 512,
  quality = 0.6,
) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
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
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
  });
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
};

const removeNearBackground = (imageData) => {
  const { data, width, height } = imageData;
  const getPixel = (x, y) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const corners = [
    getPixel(0, 0),
    getPixel(width - 1, 0),
    getPixel(0, height - 1),
    getPixel(width - 1, height - 1),
  ];

  const avgBg = corners.reduce(
    (acc, c) => [acc[0] + c[0] / 4, acc[1] + c[1] / 4, acc[2] + c[2] / 4],
    [0, 0, 0],
  );

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const dr = data[i] - avgBg[0];
      const dg = data[i + 1] - avgBg[1];
      const db = data[i + 2] - avgBg[2];
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);

      if (dist < 36) {
        data[i + 3] = 0;
      } else {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX >= maxX || minY >= maxY) {
    return { imageData, bbox: { x: 0, y: 0, w: width, h: height } };
  }

  return {
    imageData,
    bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
  };
};

const generateLocalTryOnPreview = async (productImageUrl, userImageBase64) => {
  const [userImg, productImg] = await Promise.all([
    loadImage(userImageBase64),
    loadImage(productImageUrl),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = userImg.width;
  canvas.height = userImg.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

  const productCanvas = document.createElement("canvas");
  productCanvas.width = productImg.width;
  productCanvas.height = productImg.height;
  const pctx = productCanvas.getContext("2d");
  pctx.drawImage(productImg, 0, 0, productCanvas.width, productCanvas.height);

  const productData = pctx.getImageData(
    0,
    0,
    productCanvas.width,
    productCanvas.height,
  );
  const cleaned = removeNearBackground(productData);
  pctx.putImageData(cleaned.imageData, 0, 0);

  const torsoX = canvas.width * 0.24;
  const torsoY = canvas.height * 0.2;
  const torsoW = canvas.width * 0.52;
  const torsoH = canvas.height * 0.5;

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.drawImage(
    productCanvas,
    cleaned.bbox.x,
    cleaned.bbox.y,
    cleaned.bbox.w,
    cleaned.bbox.h,
    torsoX,
    torsoY,
    torsoW,
    torsoH,
  );
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.9);
};

/**
 * Generates a virtual try-on styling advice by calling our local backend.
 * This bypasses CORS and secures our Hugging Face API key.
 */
export const generateTryOnResult = async (productImageUrl, userImageBase64, productId, userId) => {
  try {
    console.log("Frontend: Checking backend health...");
    const healthRes = await fetch(`${BACKEND_URL}/api/ai/check-limit`).catch(
      (e) => ({ message: "Server Unreachable" }),
    );
    const healthData = healthRes.json ? await healthRes.json() : healthRes;
    console.log("Frontend: Backend Health:", healthData);

    console.log("Frontend: Compressing image...");
    const compressedUserImage = await compressImage(userImageBase64);

    const sizeInKB = ((compressedUserImage.length * 0.75) / 1024).toFixed(2);
    console.log(`Frontend: Compressed image size: ~${sizeInKB} KB`);

    console.log("Frontend: Calling backend AI service...");

    const response = await fetch(`${BACKEND_URL}/api/ai/try-on`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productImageUrl,
        userImageBase64: compressedUserImage,
        productId,
        userId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Backend AI Service Error");
    }

    let outputImage = data.generatedImage || compressedUserImage;
    let outputText = data.advice;

    if (!data.aiGenerated) {
      try {
        outputImage = await generateLocalTryOnPreview(
          productImageUrl,
          compressedUserImage,
        );
        outputText = `${data.advice || "AI generation unavailable right now."} Showing a local preview overlay because AI credits/quota are unavailable.`;
      } catch (localFallbackError) {
        console.warn(
          "Frontend local fallback failed:",
          localFallbackError.message,
        );
      }
    }

    return {
      text: outputText,
      imageUrl: outputImage,
      analytics: data.analytics,
    };
  } catch (error) {
    console.error("Frontend AI Error:", error);
    throw new Error(error.message || "Failed to connect to AI service");
  }
};
