import { createClient } from '@supabase/supabase-js'

// 🔑 Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🖼️ Image compression utility
export const compressImage = (file: File, maxWidth: number = 300): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // ✅ Hitung ratio supaya aspect ratio tetap
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      const newWidth = img.width * ratio
      const newHeight = img.height * ratio

      canvas.width = newWidth
      canvas.height = newHeight

      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        }
      }, 'image/webp', 0.8)
    }

    img.src = URL.createObjectURL(file)
  })
}

// 📤 Upload image ke Supabase Storage
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const compressedFile = await compressImage(file)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, compressedFile, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error || !data) {
      console.error('Upload error:', error)
      return null
    }

    // ✅ Ambil public URL dengan benar
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicData?.publicUrl ?? null
  } catch (error) {
    console.error('Image processing error:', error)
    return null
  }
}
