import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDTO } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get(':feedbackId')
  async getFeedback(@Param('feedbackId', ParseIntPipe) feedbackId: number) {
    const { feedback } = await this.feedbackService.getFeedback(feedbackId);
    return { feedback };
  }

  @Post()
  async endInterview(@Body() data: FeedbackDTO) {
    const feedbackId = await this.feedbackService.generateFeedback(
      data.interviewId,
    );
    return { feedbackId };
  }
}
