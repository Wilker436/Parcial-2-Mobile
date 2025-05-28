// src/app/core/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async uploadAudio(file: File, bucket: string = 'audios'): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase
      .storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = this.supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async uploadFile(file: File, bucket: string = 'files'): Promise<{url: string, name: string, type: string}> {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase
        .storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = this.supabase
        .storage
        .from(bucket)
        .getPublicUrl(fileName);

    return {
        url: publicUrl,
        name: file.name,
        type: file.type
    };
}
}