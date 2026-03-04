'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Honour } from '@/lib/supabase/types'

interface Props {
  honour: Honour | null
}

export default function HonourForm({ honour }: Props) {
  const isNew = !honour
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    year: honour?.year ?? '',
    title: honour?.title ?? '',
    sort_order: honour?.sort_order?.toString() ?? '0',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = { year: form.year, title: form.title, sort_order: parseInt(form.sort_order) || 0 }

    if (isNew) {
      await supabase.from('honours').insert([payload])
    } else {
      await supabase.from('honours').update(payload).eq('id', honour!.id)
    }

    router.push('/admin/honours')
    router.refresh()
  }

  const inputClass = "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ปี *</label>
          <input
            required
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
            className={inputClass}
            placeholder="2024"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ลำดับ</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => set('sort_order', e.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ชื่อรางวัล *</label>
        <input
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={inputClass}
          placeholder="Thai League 1 — แชมป์"
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors">
          {loading ? 'กำลังบันทึก...' : isNew ? 'เพิ่มรางวัล' : 'บันทึก'}
        </button>
        <button type="button" onClick={() => router.push('/admin/honours')} className="px-6 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 hover:text-white font-heading font-medium text-sm rounded-sm transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
