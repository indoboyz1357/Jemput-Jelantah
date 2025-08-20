import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Image compression utility
export const compressImage = (file: File, maxWidth: number = 300): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, 'image/webp', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Upload image to Supabase storage
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const compressedFile = await compressImage(file);
    
    if (!supabase) {
      console.warn('Supabase env is missing; using local object URL as fallback.');
      return URL.createObjectURL(compressedFile);
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, compressedFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image processing error:', error);
    return null;
  }
};