import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const DanqLogo = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a text prompt to create Logo for Logo Title/Brand name : Guest fress,with description: The main agen, with Color combination of Sunset Vibe, also include App Logo design idea and Referring to this Logo Prompt:Create a vibrant and playful 3D logo for an app. The design should feature bold, colorful text with a glossy finish. Include an icon relevant to the apps theme above the text and a background that complements the concept, such as a bright outdoor scene with natural elements like green grass, a blue sky, and fluffy white clouds. Use a rounded square frame with a yellow border and subtle shadows for a polished and inviting look  Give me result in JSON portal with prompt field only",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "prompt": "Create a vibrant and playful 3D logo for \\"Guest fress\\". The main design element is the brand name, presented in bold, colorful text with a glossy finish, using a Sunset Vibe color combination (think warm oranges, yellows, and pinks). Include a subtle icon relevant to the main idea of \\"Guest fress\\", placed above the text. Consider a simplified icon that suggests community, hospitality, or sharing.  The background should complement the concept, using an outdoor scene but stylized to fit the Sunset Vibe, perhaps with gradients of the sunset colors, instead of a literal green grass and blue sky. Include soft, stylized elements that feel warm and inviting. Use a rounded square frame with a yellow border and subtle shadows for a polished and inviting look. The logo should convey a feeling of welcoming, warmth, and playful energy, suitable for both a primary brand logo and an app icon. Include an app logo design idea within this concept, ensure it is scalable and simple enough for icon use."\n}\n```\n',
        },
      ],
    },
  ],
});
