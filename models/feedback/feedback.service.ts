import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'database/supabase/supabase.service';
import { OpenAIService } from 'llm/openai/openai.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly openAIService: OpenAIService,
  ) {}

  async generateFeedback(interviewId: number): Promise<number> {
    const { data: msgs } = await this.supabaseService.client
      .from('messages')
      .select('role,content')
      .eq('interview_id', interviewId)
      .order('timestamp', { ascending: true });

    const transcript = msgs?.map((m) => `${m.role}: ${m.content}`).join('\n');

    const feedbackText = await this.openAIService.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Provide feedback based on this interview transcript:\n${transcript}`,
      max_tokens: 150,
    });

    const { data: inserted, error: insertError } =
      await this.supabaseService.client
        .from('feedback')
        .insert([{ interview_id: interviewId, feedback_text: feedbackText }])
        .select('id')
        .single();

    if (insertError || !inserted) {
      console.error(
        `Failed to insert feedback: ${insertError?.message ?? 'no data'}`,
      );
    }

    return inserted?.id as number;
  }

  async getFeedback(feedbackId: number) {
    const { data } = await this.supabaseService.client
      .from('feedback')
      .select('feedback_text')
      .eq('id', feedbackId)
      .single();
    return { feedback: data.feedback_text };
  }
}
