'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Props {
  value: string
  onChange: (url: string) => void
  bucket: string
  folder?: string
  label?: string
  aspectRatio?: 'square' | 'video' | 'portrait'
}

export default function ImageUpload({
  value,
  onChange,
  bucket,
  folder,
  label,
  aspectRatio = 'video',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClass = {
    square:   'aspect-square',
    video:    'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio]

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // ตรวจ type
    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }
    // ตรวจขนาด (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ไฟล์ต้องมีขนาดไม่เกิน 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = folder ? `${folder}/${filename}` : filename

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setError(`อัพโหลดไม่สำเร็จ: ${uploadError.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      onChange(publicUrl)
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setUploading(false)
      // reset input เพื่อให้เลือกไฟล์เดิมซ้ำได้
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Preview */}
      {value ? (
        <div className={`relative ${aspectClass} bg-[#1E1E1E] rounded-sm overflow-hidden group mb-2`}>
          <Image
            src={value}
            alt="preview"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white text-xs font-heading rounded-sm transition-colors"
            >
              <Upload size={12} /> เปลี่ยนรูป
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] hover:border-red-500 text-gray-300 hover:text-red-400 text-xs font-heading rounded-sm transition-colors"
            >
              <X size={12} /> ลบ
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        /* Upload area */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full ${aspectClass} bg-[#1E1E1E] border-2 border-dashed border-[#2A2A2A] hover:border-[#B91C1C]/50 rounded-sm flex flex-col items-center justify-center gap-2 transition-colors group mb-2`}
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={28} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              <span className="text-xs text-gray-500 group-hover:text-gray-400 font-heading transition-colors">
                คลิกเพื่ออัพโหลดรูป
              </span>
              <span className="text-[10px] text-gray-700">PNG, JPG, WEBP · สูงสุด 5MB</span>
            </>
          )}
        </button>
      )}

      {/* URL input fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="หรือวาง URL รูปภาพ..."
          className="flex-1 bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-3 py-2 text-white text-xs focus:outline-none focus:border-[#B91C1C] transition-colors font-mono placeholder:text-gray-700"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#B91C1C]/50 text-gray-400 hover:text-white text-xs font-heading rounded-sm transition-colors whitespace-nowrap disabled:opacity-50"
        >
          <Upload size={12} />
          {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-heading">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
