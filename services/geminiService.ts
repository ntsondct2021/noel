
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI using process.env.API_KEY directly as per @google/genai guidelines.
// Removed prohibited manual API key validation and user instructions.

export async function transformImage(base64Image: string, prompt: string): Promise<string> {
  // Always use process.env.API_KEY directly for initialization.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const modelName = 'gemini-2.5-flash-image';
  
  // Extract mime type if available to ensure correct processing.
  const mimeMatch = base64Image.match(/data:([^;]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const imageData = base64Image.split(',')[1] || base64Image;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: imageData,
    },
  };

  const textPart = {
    text: `
      Christmas Transformation Task:
      ${prompt}. 
      
      Critical Instructions:
      1. HIGH QUALITY: Ensure the final result is sharp and artistic.
      2. IDENTITY PRESERVATION: Do not change the facial features of people.
      3. ATMOSPHERE: Make it feel magical and festive.
    `
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("AI không trả về kết quả. Thử lại sau nhé!");
    }

    // Find the image part in the response as per guidelines (do not assume first part is image).
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Không tìm thấy dữ liệu ảnh trong phản hồi.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Đã có lỗi xảy ra khi gọi AI.");
  }
}
