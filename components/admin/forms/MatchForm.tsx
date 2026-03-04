'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Match } from '@/lib/supabase/types'
import ImageUpload from '@/components/admin/ImageUpload'

interface Props {
  match: Match | null
}

function toDatetimeLocal(iso: string) {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 16)
}

export default function MatchForm({ match }: Props) {
  const isNew = !match
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    opponent: match?.opponent ?? '',
    opponent_logo: match?.opponent_logo ?? '',
    match_date: match ? toDatetimeLocal(match.match_date) : '',
    venue: match?.venue ?? '',
    competition: match?.competition ?? 'Thai League 1',
    is_home: match?.is_home ?? true,
    home_score: match?.home_score?.toString() ?? '',
    away_score: match?.away_score?.toString() ?? '',
  })

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const payload = {
      opponent: form.opponent,
      opponent_logo: form.opponent_logo || null,
      match_date: new Date(form.match_date).toISOString(),
      venue: form.venue || null,
      competition: form.competition || null,
      is_home: form.is_home,
      home_score: form.home_score !== '' ? parseInt(form.home_score) : null,
      away_score: form.away_score !== '' ? parseInt(form.away_score) : null,
    }

    if (isNew) {
      await supabase.from('matches').insert([payload])
    } else {
      await supabase.from('matches').update(payload).eq('id', match!.id)
    }

    router.push('/admin/matches')
    router.refresh()
  }

  const inputClass = "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ชื่อทีมคู่แข่ง *</label>
          <input required value={form.opponent} onChange={(e) => set('opponent', e.target.value)} className={inputClass} placeholder="ทีม X FC" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">รายการแข่ง</label>
          <input value={form.competition} onChange={(e) => set('competition', e.target.value)} className={inputClass} placeholder="Thai League 1" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">วันและเวลา *</label>
          <input required type="datetime-local" value={form.match_date} onChange={(e) => set('match_date', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">สนาม</label>
          <input value={form.venue} onChange={(e) => set('venue', e.target.value)} className={inputClass} placeholder="สนามกีฬากลาง ขอนแก่น" />
        </div>
      </div>

      {/* Opponent logo upload */}
      <ImageUpload
        label="โลโก้ทีมคู่แข่ง"
        value={form.opponent_logo}
        onChange={(url) => set('opponent_logo', url)}
        bucket="uploads"
        folder="logos"
        aspectRatio="square"
      />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_home" checked={form.is_home} onChange={(e) => set('is_home', e.target.checked)} className="w-4 h-4 accent-[#B91C1C]" />
        <label htmlFor="is_home" className="text-sm text-gray-400 font-heading">เกมเหย้า (KKU เป็นทีมเหย้า)</label>
      </div>

      {/* Score */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">
          ผลการแข่งขัน (เว้นว่างถ้ายังไม่แข่ง)
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1.5">{form.is_home ? 'KKU (เหย้า)' : form.opponent + ' (เหย้า)'}</p>
            <input type="number" min="0" value={form.home_score} onChange={(e) => set('home_score', e.target.value)} className={`${inputClass} text-center`} placeholder="—" />
          </div>
          <span className="font-display text-2xl text-gray-600 pt-6">:</span>
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1.5">{form.is_home ? form.opponent + ' (เยือน)' : 'KKU (เยือน)'}</p>
            <input type="number" min="0" value={form.away_score} onChange={(e) => set('away_score', e.target.value)} className={`${inputClass} text-center`} placeholder="—" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors">
          {loading ? 'กำลังบันทึก...' : isNew ? 'เพิ่มแมตช์' : 'บันทึก'}
        </button>
        <button type="button" onClick={() => router.push('/admin/matches')} className="px-6 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 hover:text-white font-heading font-medium text-sm rounded-sm transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
