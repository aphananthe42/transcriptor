import { OpenAI } from "../deps.ts";

export class OpenAIService {
  private shared: OpenAI;

  constructor() {
    this.shared = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
  }

  async sendPrompt(transcription: string): Promise<string> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        {
          role: "system",
          content: Deno.env.get("OPENAI_SYSTEM_PROMPT") ?? "",
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      model: Deno.env.get("OPENAI_GPT_MODEL") ?? "gpt-3.5-turbo",
    };
    const chatCompletion = await this.shared.chat.completions.create(params);
    return chatCompletion.choices[0].message.content ?? "";
  }
}
