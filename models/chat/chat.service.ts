import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'database/supabase/supabase.service';
import { OpenAIService } from 'llm/openai/openai.service';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';

@Injectable()
export class ChatService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openAIService: OpenAIService,
  ) {}

  async handleMessage(interviewId: number, message: string) {
    const client = this.supabaseService.client;

    const { data: interview } = await client
      .from('interviews')
      .select('resume_text, job_desc_text')
      .eq('id', interviewId)
      .single();

    const { data: history } = await client
      .from('messages')
      .select('role, content')
      .eq('interview_id', interviewId)
      .order('timestamp', { ascending: true });

    const askedCount =
      history?.filter((m) => m.role === 'assistant').length ?? 0;

    if (message === '__start__') {
      const systemMsg: CreateChatCompletionRequestMessage = {
        role: 'system',
        content: `You are a technical interviewer. Based on the resume and job description provided, ask exactly 5 sequential technical questions. Resume: ${interview?.resume_text}. Job Description: ${interview?.job_desc_text}. Ask the first question now.`,
      };

      const assistant = await this.openAIService.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [systemMsg],
      });

      await client.from('messages').insert([
        {
          interview_id: interviewId,
          role: 'assistant',
          content: assistant.content!,
        },
      ]);

      return { role: assistant.role, content: assistant.content! };
    }

    if (askedCount >= 5) {
      const finalMsg =
        'You have completed all 5 questions. Please click "End Interview" to receive your personalized feedback.';

      await client
        .from('messages')
        .insert([
          { interview_id: interviewId, role: 'assistant', content: finalMsg },
        ]);

      return { role: 'assistant', content: finalMsg };
    }

    const messages: CreateChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content:
          'You are a technical interviewer continuing to ask the next question.',
      },
      ...history!.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const assistant = await this.openAIService.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    await client.from('messages').insert([
      { interview_id: interviewId, role: 'user', content: message },
      {
        interview_id: interviewId,
        role: assistant.role,
        content: assistant.content!,
      },
    ]);

    return { role: assistant.role, content: assistant.content! };
  }
}
