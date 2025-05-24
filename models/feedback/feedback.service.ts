import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'database/supabase/supabase.service';
import OpenAI from 'openai';

@Injectable()
export class FeedbackService {
  private openai: OpenAI;

  constructor(private readonly supabaseService: SupabaseService) {
    this.openai = new OpenAI({
      apiKey:
        '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',
    });
  }

  async generateFeedback(interviewId: number): Promise<number> {
    const { data: msgs } = await this.supabaseService.client
      .from('messages')
      .select('role,content')
      .eq('interview_id', interviewId)
      .order('timestamp', { ascending: true });

    const transcript = msgs?.map((m) => `${m.role}: ${m.content}`).join('\n');

    const resp = await this.openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Provide feedback based on this interview transcript:\n${transcript}`,
      max_tokens: 150,
    });

    const feedbackText = resp.choices[0].text.trim();

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
