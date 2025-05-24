import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(private readonly config: ConfigService) {
    const OPENAI_API_KEY = this.config.get<string>('OPENAI_API_KEY');
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  async createCompletion({
    model,
    prompt,
    max_tokens,
  }: {
    model: string;
    prompt: string;
    max_tokens: number;
  }) {
    const res = await this.client.completions.create({
      model,
      prompt,
      max_tokens,
    });
    const text = res.choices[0].text.trim();
    return text;
  }

  async createChatCompletion({
    model,
    messages,
  }: {
    model: string;
    messages: CreateChatCompletionRequestMessage[];
  }): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const res = await this.client.chat.completions.create({
      model,
      messages,
    });
    const msg = res.choices[0].message!;
    return msg;
  }
}
