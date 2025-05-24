import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SupabaseService } from 'database/supabase/supabase.service';
import { OpenAIService } from 'llm/openai/openai.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, SupabaseService, OpenAIService],
})
export class ChatModule {}
