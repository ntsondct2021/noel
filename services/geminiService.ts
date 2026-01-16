
import { GoogleGenAI } from "@google/genai";

/**
 * HƯỚNG DẪN CẤU HÌNH API KEY CHO APP:
 * 
 * Cách 1 (Khuyên dùng): Tạo file tên là `.env` ở thư mục gốc của dự án.
 * Nội dung file .env:
 * API_KEY=AIzaSyB... (Dán key của bạn vào đây)
 * 
 * Cách 2: Nếu bạn muốn chạy nhanh để test, có thể thay dòng:
 * const apiKey = process.env.API_KEY; 
 * thành:
 * const apiKey = "KEY_CỦA_BẠN_Ở_ĐÂY";
 */
export async function transformImage(base64Image: string, prompt: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error(
      "LỖI: Chưa cấu hình API Key!\n\n" +
      "Để khắc phục:\n" +
      "1. Lấy Key tại: https://aistudio.google.com/app/apikey\n" +
      "2. Tạo file '.env' ở thư mục chứa code này.\n" +
      "3. Thêm dòng này vào file .env: API_KEY=Key_Của_Bạn"
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash-image';
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  const textPart = {
    text: `
      Christmas Transformation Task:
      ${prompt}. 
      
      Critical Instructions:
      1. HIGH QUALITY: Ensure the final result is sharp, vibrant, and artistic.
      2. IDENTITY PRESERVATION: Do not significantly alter the facial features or identity of the people in the original image. Only add Christmas themes, costumes, and background changes around them.
      3. ATMOSPHERE: Make it feel magical, heartwarming, and festive.
      4. LIGHTING: Adjust the global illumination to match the Christmas theme (warm glows, bokeh, or cool winter light).
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
      throw new Error("AI không thể tạo ảnh vào lúc này. Vui lòng thử lại sau.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Dữ liệu trả về không hợp lệ.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429')) {
      throw new Error("Hệ thống đang quá tải! Vui lòng đợi Santa 1 phút rồi thử lại nhé.");
    }
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error("API Key của bạn không hợp lệ hoặc đã hết hạn.");
    }
    throw new Error(error.message || "Đã có lỗi xảy ra trong quá trình xử lý ảnh.");
  }
}
