'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ClubSetting } from '@/lib/supabase/types'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

interface Props {
  initialSettings: ClubSetting[]
}

// key ที่เป็น image ให้ใช้ ImageUpload แทน text input
const IMAGE_KEYS = new Set(['stadium_image'])

const SETTING_LABELS: Record<string, { label: string; multiline?: boolean }> = {
  founded:          { label: 'ปีก่อตั้ง' },
  colors:           { label: 'สีทีม' },
  league:           { label: 'ลีกที่แข่ง' },
  nickname:         { label: 'ฉายา' },
  stadium_name:     { label: 'ชื่อสนาม' },
  stadium_location: { label: 'ที่ตั้งสนาม' },
  stadium_capacity: { label: 'ความจุ' },
  stadium_image:    { label: 'รูปภาพสนาม' },
  history:          { label: 'ประวัติสโมสร', multiline: true },
  contact_email:    { label: 'อีเมลติดต่อ' },
  shop_email:       { label: 'อีเมลร้านค้า' },
}

export default function SettingsClient({ initialSettings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(initialSettings.map((s) => [s.key, s.value]))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    for (const [key, value] of Object.entries(values)) {
      await supabase
        .from('club_settings')
        .upsert({ key, value }, { onConflict: 'key' })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  const inputClass = "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-5">
      {Object.entries(SETTING_LABELS).map(([key, { label, multiline }]) => (
        <div key={key}>
          {IMAGE_KEYS.has(key) ? (
            <ImageUpload
              label={label}
              value={values[key] ?? ''}
              onChange={(url) => setValues((v) => ({ ...v, [key]: url }))}
              bucket="uploads"
              folder="general"
              aspectRatio="video"
            />
          ) : (
            <>
              <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">
                {label}
              </label>
              {multiline ? (
                <textarea
                  value={values[key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <input
                  value={values[key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </>
          )}
        </div>
      ))}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors"
        >
          <Save size={14} />
          {saving ? 'กำลังบันทึก...' : saved ? 'บันทึกแล้ว ✓' : 'บันทึกการตั้งค่า'}
        </button>
      </div>
    </form>
  )
}
