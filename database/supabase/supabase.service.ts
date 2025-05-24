import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;
  constructor(private readonly config: ConfigService) {
    const SUPABASE_URL = this.config.get<string>('SUPABASE_URL');
    const SUPABASE_KEY = this.config.get<string>('SUPABASE_KEY');
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
}
