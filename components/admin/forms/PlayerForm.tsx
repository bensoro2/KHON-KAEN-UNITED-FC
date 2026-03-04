'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Player } from '@/lib/supabase/types'
import ImageUpload from '@/components/admin/ImageUpload'

interface Props {
  player: Player | null
}

export default function PlayerForm({ player }: Props) {
  const isNew = !player
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: player?.name ?? '',
    name_th: player?.name_th ?? '',
    number: player?.number?.toString() ?? '',
    position: player?.position ?? 'MID',
    nationality: player?.nationality ?? 'Thailand',
    image_url: player?.image_url ?? '',
    bio: player?.bio ?? '',
    is_active: player?.is_active ?? true,
    sort_order: player?.sort_order?.toString() ?? '0',
  })

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const payload = {
      name: form.name,
      name_th: form.name_th || null,
      number: form.number ? parseInt(form.number) : null,
      position: form.position,
      nationality: form.nationality || null,
      image_url: form.image_url || null,
      bio: form.bio || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    }

    if (isNew) {
      await supabase.from('players').insert([payload])
    } else {
      await supabase.from('players').update(payload).eq('id', player!.id)
    }

    router.push('/admin/players')
    router.refresh()
  }

  const inputClass = "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ชื่อ (EN) *</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="John Smith" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ชื่อ (TH)</label>
          <input value={form.name_th} onChange={(e) => set('name_th', e.target.value)} className={inputClass} placeholder="จอห์น สมิธ" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">เบอร์</label>
          <input type="number" min="1" max="99" value={form.number} onChange={(e) => set('number', e.target.value)} className={inputClass} placeholder="9" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ตำแหน่ง *</label>
          <select value={form.position} onChange={(e) => set('position', e.target.value)} className={inputClass}>
            <option value="GK">ผู้รักษาประตู (GK)</option>
            <option value="DEF">กองหลัง (DEF)</option>
            <option value="MID">กองกลาง (MID)</option>
            <option value="FWD">กองหน้า (FWD)</option>
            <option value="STAFF">สตาฟโค้ช</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">สัญชาติ</label>
          <input value={form.nationality} onChange={(e) => set('nationality', e.target.value)} className={inputClass} placeholder="Thailand" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ลำดับ</label>
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className={inputClass} placeholder="0" />
        </div>
      </div>

      <ImageUpload
        label="รูปผู้เล่น"
        value={form.image_url}
        onChange={(url) => set('image_url', url)}
        bucket="uploads"
        folder="players"
        aspectRatio="portrait"
      />

      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ประวัติ</label>
        <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="ประวัติผู้เล่น..." />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B91C1C]" />
        <label htmlFor="is_active" className="text-sm text-gray-400 font-heading">ผู้เล่น Active</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors">
          {loading ? 'กำลังบันทึก...' : isNew ? 'เพิ่มผู้เล่น' : 'บันทึก'}
        </button>
        <button type="button" onClick={() => router.push('/admin/players')} className="px-6 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 hover:text-white font-heading font-medium text-sm rounded-sm transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
