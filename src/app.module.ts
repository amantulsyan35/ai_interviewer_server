import { Module } from '@nestjs/common';
import { SupabaseService } from 'database/supabase/supabase.service';
import { ChatModule } from 'models/chat/chat.module';
import { UploadModule } from 'models/doc-upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { FeedbackModule } from 'models/feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UploadModule,
    ChatModule,
    FeedbackModule,
  ],
  providers: [SupabaseService],
})
export class AppModule {}
