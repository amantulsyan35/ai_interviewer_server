import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'database/supabase/supabase.service';

@Injectable()
export class UploadService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createInterview(resume: string, jobDesc: string) {
    const { data, error } = await this.supabaseService.client
      .from('interviews')
      .insert([{ resume_text: resume, job_desc_text: jobDesc }])
      .select('id')
      .single();

    if (error) {
      console.error('supabase insert error:', error);
      throw new HttpException('Supabase Insert Error', HttpStatus.CONFLICT);
    }

    return { interviewId: data.id };
  }
}
