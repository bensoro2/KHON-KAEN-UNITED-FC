import { createClient } from '@/lib/supabase/server'
import MatchCard from '@/components/fixtures/MatchCard'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'ตารางแข่งขัน' }

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function FixturesPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const isResults = tab === 'results'
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data: upcoming } = await supabase
    .from('matches')
    .select('*')
    .gt('match_date', now)
    .is('home_score', null)
    .order('match_date', { ascending: true })

  const { data: results } = await supabase
    .from('matches')
    .select('*')
    .not('home_score', 'is', null)
    .order('match_date', { ascending: false })

  const displayList = isResults ? (results ?? []) : (upcoming ?? [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-2">
          ฤดูกาล 2025/26
        </p>
        <h1 className="font-display text-5xl text-white">ตารางแข่งขัน</h1>
      </div>

      {/* Tab */}
      <div className="flex gap-1 mb-8 bg-[#141414] border border-[#2A2A2A] rounded-sm p-1 w-fit">
        <a
          href="/fixtures"
          className={`px-5 py-2 text-sm font-heading font-medium rounded-sm transition-colors ${
            !isResults ? 'bg-[#B91C1C] text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          กำลังจะมา ({upcoming?.length ?? 0})
        </a>
        <a
          href="/fixtures?tab=results"
          className={`px-5 py-2 text-sm font-heading font-medium rounded-sm transition-colors ${
            isResults ? 'bg-[#B91C1C] text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          ผลการแข่ง ({results?.length ?? 0})
        </a>
      </div>

      {/* List */}
      {displayList.length > 0 ? (
        <div className="space-y-3">
          {displayList.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-4xl mb-2">ยังไม่มีข้อมูล</p>
        </div>
      )}
    </div>
  )
}
