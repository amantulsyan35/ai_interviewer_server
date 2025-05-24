import { IsInt } from 'class-validator';

export class FeedbackDTO {
  @IsInt()
  interviewId: number;
}

export class GetFeedbackDTO {
  @IsInt()
  feedbackId: number;
}
