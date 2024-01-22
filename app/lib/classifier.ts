import { OpenAI } from "openai";
import { OpenAIStream } from "ai";

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getCompletion = async (file: File, stream = false) => {
  const encoded = await file
    .arrayBuffer()
    .then((buffer) => Buffer.from(buffer).toString("base64"));

  const completion = await openAi.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this image as if you were David Attenborough. Provide as much detail as possible.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${encoded}`,
            },
          },
        ],
      },
    ],
    stream,
    max_tokens: 1000,
  });

  return completion;
};

export const classifyImage = async (file: File): Promise<string> => {
  const completion = (await getCompletion(
    file
  )) as OpenAI.Chat.Completions.ChatCompletion;

  const response = completion?.choices?.[0]?.message?.content;

  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return response;
};

export const classifyImageStream = async (file: File) => {
  const completion = (await getCompletion(file, true)) as any;

  return OpenAIStream(completion);
};
