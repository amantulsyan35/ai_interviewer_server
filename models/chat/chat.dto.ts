import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChatDTO {
  @IsInt()
  interviewId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
