import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'ตารางคะแนน' }

export default async function StandingsPage() {
  const supabase = await createClient()

  const { data: standings } = await supabase
    .from('standings')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-2">
          ฤดูกาล 2025/26
        </p>
        <h1 className="font-display text-5xl text-white">ตารางคะแนน</h1>
      </div>

      {standings && standings.length > 0 ? (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_repeat(6,auto)] gap-x-4 px-4 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading tracking-wider uppercase">
            <span className="w-6 text-center">#</span>
            <span>ทีม</span>
            <span className="w-8 text-center">แข่ง</span>
            <span className="w-8 text-center">ชนะ</span>
            <span className="w-8 text-center">เสมอ</span>
            <span className="w-8 text-center">แพ้</span>
            <span className="w-10 text-center">GD</span>
            <span className="w-10 text-center font-bold text-white">คะแนน</span>
          </div>

          {/* Rows */}
          {standings.map((row, index) => {
            const isKKU = row.team_name.toLowerCase().includes('khon kaen')
            const gd = row.gf - row.ga
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[auto_1fr_repeat(6,auto)] gap-x-4 px-4 py-3 border-b border-[#2A2A2A] last:border-b-0 items-center transition-colors hover:bg-[#1E1E1E] ${
                  isKKU ? 'border-l-2 border-l-[#C9A84C] bg-[#C9A84C]/5' : ''
                }`}
              >
                <span className={`w-6 text-center text-sm font-heading ${isKKU ? 'text-[#C9A84C] font-bold' : 'text-gray-500'}`}>
                  {index + 1}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 relative flex-shrink-0">
                    {row.logo_url ? (
                      <Image src={row.logo_url} alt={row.team_name} fill className="object-contain" />
                    ) : (
                      <div className="w-7 h-7 bg-[#2A2A2A] rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm font-heading font-medium truncate ${isKKU ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {row.team_name}
                  </span>
                </div>
                <span className="w-8 text-center text-sm text-gray-400">{row.played}</span>
                <span className="w-8 text-center text-sm text-gray-400">{row.won}</span>
                <span className="w-8 text-center text-sm text-gray-400">{row.drawn}</span>
                <span className="w-8 text-center text-sm text-gray-400">{row.lost}</span>
                <span className={`w-10 text-center text-sm ${gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {gd > 0 ? `+${gd}` : gd}
                </span>
                <span className={`w-10 text-center text-sm font-bold font-heading ${isKKU ? 'text-[#C9A84C]' : 'text-white'}`}>
                  {row.points}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-4xl">ยังไม่มีข้อมูลตารางคะแนน</p>
        </div>
      )}
    </div>
  )
}
