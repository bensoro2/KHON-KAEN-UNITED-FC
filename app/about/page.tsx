import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import Image from 'next/image'
import { ClubSetting, Honour } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'เกี่ยวกับสโมสร' }

function getSetting(settings: ClubSetting[], key: string) {
  return settings.find((s) => s.key === key)?.value ?? ''
}

export default async function AboutPage() {
  const supabase = await createClient()

  const [{ data: honours }, { data: settings }] = await Promise.all([
    supabase.from('honours').select('*').order('sort_order', { ascending: true }),
    supabase.from('club_settings').select('*'),
  ])

  const s = (key: string) => getSetting(settings ?? [], key)

  const clubInfoCards = [
    { label: 'ก่อตั้ง',  value: s('founded')  || '—' },
    { label: 'สีทีม',    value: s('colors')    || '—' },
    { label: 'ลีก',      value: s('league')    || '—' },
    { label: 'ฉายา',     value: s('nickname')  || '—' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#7F1D1D] via-[#1A0A0A] to-[#0A0A0A] flex items-center justify-center mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.2)_0%,transparent_70%)]" />
        <div className="relative text-center">
          <div className="w-24 h-24 relative mx-auto mb-4">
            <Image src="/logo.png" alt="Khon Kaen United" fill className="object-contain" />
          </div>
          <h1 className="font-display text-5xl text-white">KHON KAEN UNITED FC</h1>
          <p className="text-[#C9A84C] font-heading tracking-widest mt-1">{s('nickname') || 'จงอางผยอง'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-16">
        {/* History */}
        {s('history') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#B91C1C]" />
              <h2 className="font-heading font-semibold text-white text-xl tracking-wide">ประวัติสโมสร</h2>
            </div>
            <div className="text-gray-400 leading-relaxed whitespace-pre-line">
              {s('history')}
            </div>
          </section>
        )}

        {/* Honours */}
        {honours && honours.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#C9A84C]" />
              <h2 className="font-heading font-semibold text-white text-xl tracking-wide">ถ้วยรางวัล</h2>
            </div>
            <div className="space-y-3">
              {(honours as Honour[]).map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-5 bg-[#141414] border border-[#2A2A2A] rounded-sm px-5 py-4"
                >
                  <span className="font-display text-2xl text-[#C9A84C] flex-shrink-0">{h.year}</span>
                  <span className="font-heading text-white text-sm">{h.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stadium */}
        {s('stadium_name') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#B91C1C]" />
              <h2 className="font-heading font-semibold text-white text-xl tracking-wide">สนามเหย้า</h2>
            </div>
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 grid sm:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-widest mb-1">สนาม</p>
                  <p className="text-white font-heading font-medium">{s('stadium_name')}</p>
                </div>
                {s('stadium_location') && (
                  <div>
                    <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-widest mb-1">ที่ตั้ง</p>
                    <p className="text-gray-400">{s('stadium_location')}</p>
                  </div>
                )}
                {s('stadium_capacity') && (
                  <div>
                    <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-widest mb-1">ความจุ</p>
                    <p className="text-gray-400">{s('stadium_capacity')}</p>
                  </div>
                )}
              </div>
              {/* Stadium image */}
              <div className="relative aspect-video bg-[#1E1E1E] rounded-sm overflow-hidden">
                {s('stadium_image') ? (
                  <Image
                    src={s('stadium_image')}
                    alt={s('stadium_name')}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-4xl">
                    🏟️
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Club info */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#B91C1C]" />
            <h2 className="font-heading font-semibold text-white text-xl tracking-wide">ข้อมูลสโมสร</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {clubInfoCards.map((item) => (
              <div key={item.label} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 text-center">
                <p className="font-heading font-semibold text-white text-sm">{item.value}</p>
                <p className="text-xs text-gray-500 font-heading mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
