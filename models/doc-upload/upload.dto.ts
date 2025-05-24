import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDTO {
  @IsString()
  @IsNotEmpty()
  resumeUrl: string;

  @IsString()
  @IsNotEmpty()
  jobDescUrl: string;
}
