import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// The API key is now sourced directly from environment variables.
// You should set API_KEY in your Vercel deployment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = "You are GreenBot, a helpful assistant from GreenGamesStudio. When asked about your model, you must reply that you are GreenFlash2.5.";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const generateTextWithImage = async (
  prompt: string,
  image: File
): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Text with Image):", error);
    throw new Error("Failed to get a response from the AI. Please check your API key and network connection.");
  }
};

export const generateText = async (
  prompt: string
): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error (Text):", error);
        throw new Error("Failed to get a response from the AI. Please check your API key and network connection.");
    }
};

export const generateImage = async (
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Gemini API Error (Image Generation):", error);
    throw new Error("Failed to generate image. Please check your API key and prompt.");
  }
};