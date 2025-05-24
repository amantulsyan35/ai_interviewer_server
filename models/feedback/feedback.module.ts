import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { SupabaseService } from 'database/supabase/supabase.service';
import { OpenAIService } from 'llm/openai/openai.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, SupabaseService, OpenAIService],
})
export class FeedbackModule {}
