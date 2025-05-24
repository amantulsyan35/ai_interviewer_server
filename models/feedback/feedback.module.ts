import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { SupabaseService } from 'database/supabase/supabase.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, SupabaseService],
})
export class FeedbackModule {}
