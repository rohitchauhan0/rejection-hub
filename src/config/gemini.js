const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
export const songmodel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "aaj meri crush ne mujhe ignore kar dia or mujhe bahut dukh ho rha hai please suggest me a hindi song only one and give me only the name of the song in english "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "\"Channa Mereya\"\n"},
          ],
        },
      ],
    });
