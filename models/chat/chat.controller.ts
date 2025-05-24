import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDTO } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() data: ChatDTO) {
    return this.chatService.handleMessage(data.interviewId, data.message);
  }
}
