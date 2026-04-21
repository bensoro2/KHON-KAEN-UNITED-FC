'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  matchId: string
  logoUrl: string | null
  opponentName: string
}

export default function MatchLogoCell({ matchId, logoUrl, opponentName }: Props) {
  const [uploading, setUploading] = useState(false)
  const [currentLogo, setCurrentLogo] = useState(logoUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('uploads')
        .upload(`logos/${filename}`, file, { upsert: true })

      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(`logos/${filename}`)
        await supabase.from('matches').update({ opponent_logo: publicUrl }).eq('id', matchId)
        setCurrentLogo(publicUrl)
        router.refresh()
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title={`อัพโหลดโลโก้ ${opponentName}`}
        className="relative w-8 h-8 rounded-full overflow-hidden bg-[#2A2A2A] hover:ring-2 hover:ring-[#B91C1C] transition-all flex items-center justify-center group flex-shrink-0"
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        ) : currentLogo ? (
          <>
            <Image src={currentLogo} alt={opponentName} fill className="object-contain p-0.5" unoptimized />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={10} className="text-white" />
            </div>
          </>
        ) : (
          <Upload size={12} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </>
  )
}
