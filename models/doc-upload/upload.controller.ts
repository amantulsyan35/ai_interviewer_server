import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadDTO } from './upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async upload(@Body() data: UploadDTO) {
    return await this.uploadService.createInterview(
      data.resumeUrl,
      data.jobDescUrl,
    );
  }
}
