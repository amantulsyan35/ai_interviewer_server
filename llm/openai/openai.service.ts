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
