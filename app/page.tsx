import { createClient } from '@/lib/supabase/server'
import HeroBanner from '@/components/home/HeroBanner'
import NextMatchCard from '@/components/home/NextMatchCard'
import LastResultCard from '@/components/home/LastResultCard'
import NewsCard from '@/components/news/NewsCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const now = new Date().toISOString()

  const [{ data: nextMatch }, { data: lastMatch }, { data: latestNews }] = await Promise.all([
    // Next upcoming match
    supabase
      .from('matches')
      .select('*')
      .gt('match_date', now)
      .is('home_score', null)
      .order('match_date', { ascending: true })
      .limit(1)
      .single(),
    // Last played match
    supabase
      .from('matches')
      .select('*')
      .not('home_score', 'is', null)
      .order('match_date', { ascending: false })
      .limit(1)
      .single(),
    // Latest 3 news
    supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  return (
    <>
      <HeroBanner />

      {/* Match section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-heading font-semibold text-[#C9A84C] text-xs tracking-widest uppercase mb-4">
              แมตช์ถัดไป
            </h2>
            <NextMatchCard match={nextMatch ?? null} />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-[#C9A84C] text-xs tracking-widest uppercase mb-4">
              ผลล่าสุด
            </h2>
            <LastResultCard match={lastMatch ?? null} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent" />
      </div>

      {/* News section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-1">
              อัปเดตล่าสุด
            </p>
            <h2 className="font-display text-4xl text-white">ข่าวสาร</h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors font-heading"
          >
            ดูทั้งหมด <ArrowRight size={14} />
          </Link>
        </div>

        {latestNews && latestNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600">
            <p className="font-heading">ยังไม่มีข่าว</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#7F1D1D] to-[#B91C1C] rounded-sm p-10 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-3">
            เป็นส่วนหนึ่งของพวกเรา
          </h2>
          <p className="text-red-100 mb-8 font-heading">
            ติดตามทุกความเคลื่อนไหวของงูเห่าสายฟ้า
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/team"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#B91C1C] font-heading font-semibold tracking-wide rounded-sm hover:bg-gray-100 transition-colors"
            >
              ดูทีมของเรา
            </Link>
            <Link
              href="/fixtures"
              className="inline-flex items-center justify-center px-8 py-3 border border-white/50 text-white font-heading font-semibold tracking-wide rounded-sm hover:bg-white/10 transition-colors"
            >
              ตารางแข่ง
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
