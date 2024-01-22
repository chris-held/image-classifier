import { OpenAI } from "openai";

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const getGreeting = async () => {
  const completion = await openAi.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Introduce this concept as if you were David Attenborogh narrating the beginning of a ducmentary:
              An image classifier that describes your image in the voice of Sir David Attenborogh.
            `,
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  const response = completion?.choices?.[0]?.message?.content;

  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return response;
};
