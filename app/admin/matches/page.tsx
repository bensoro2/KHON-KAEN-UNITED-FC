import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminMatchesPage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white">แมตช์</h1>
          <p className="text-gray-500 font-heading text-sm mt-1">{matches?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/admin/matches/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          <Plus size={16} /> เพิ่มแมตช์
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading uppercase tracking-wider">
          <span>แมตช์</span>
          <span>วันที่</span>
          <span>ผล</span>
          <span>รายการ</span>
          <span>จัดการ</span>
        </div>
        {matches?.map((m) => {
          const hasResult = m.home_score !== null
          const kkuScore = m.is_home ? m.home_score : m.away_score
          const oppScore = m.is_home ? m.away_score : m.home_score
          let resultColor = 'text-gray-500'
          if (hasResult) {
            resultColor = kkuScore > oppScore ? 'text-green-400' : kkuScore < oppScore ? 'text-red-400' : 'text-yellow-400'
          }

          return (
            <div
              key={m.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-[#2A2A2A] last:border-b-0 items-center hover:bg-[#1A1A1A] transition-colors"
            >
              <p className="text-sm text-white font-heading">
                {m.is_home ? 'KKU' : m.opponent} vs {m.is_home ? m.opponent : 'KKU'}
                <span className="ml-2 text-xs text-gray-600">{m.is_home ? '(เหย้า)' : '(เยือน)'}</span>
              </p>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(m.match_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className={`text-sm font-display ${resultColor}`}>
                {hasResult ? `${m.home_score}–${m.away_score}` : '—'}
              </span>
              <span className="text-xs text-gray-500 max-w-[100px] truncate">{m.competition}</span>
              <div className="flex items-center gap-2">
                <Link href={`/admin/matches/${m.id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E1E1E] rounded-sm transition-colors">
                  <Pencil size={14} />
                </Link>
                <DeleteButton id={m.id} table="matches" />
              </div>
            </div>
          )
        })}
        {(!matches || matches.length === 0) && (
          <div className="text-center py-12 text-gray-600">
            <p className="font-heading">ยังไม่มีแมตช์</p>
          </div>
        )}
      </div>
    </div>
  )
}
