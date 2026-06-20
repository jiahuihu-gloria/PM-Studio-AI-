import OpenAI from "openai";

export interface AIJsonClient {
  generateJson<T>(params: {
    system: string;
    user: string;
    fallback: T;
  }): Promise<T>;
}

export class OpenAIJsonClient implements AIJsonClient {
  private client: OpenAI | null;
  private model: string;

  constructor() {
    this.client = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  }

  async generateJson<T>({
    system,
    user,
    fallback
  }: {
    system: string;
    user: string;
    fallback: T;
  }): Promise<T> {
    if (!this.client) {
      return fallback;
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return fallback;
      }

      return JSON.parse(content) as T;
    } catch {
      return fallback;
    }
  }
}
