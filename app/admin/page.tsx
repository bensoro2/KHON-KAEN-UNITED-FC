import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Newspaper, Users, Calendar, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: newsCount },
    { count: playerCount },
    { count: matchCount },
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentNews } = await supabase
    .from('news')
    .select('id, title, published_at, category')
    .order('published_at', { ascending: false })
    .limit(5)

  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('*')
    .is('home_score', null)
    .order('match_date', { ascending: true })
    .limit(3)

  const STATS = [
    { label: 'ข่าวทั้งหมด', value: newsCount ?? 0, icon: Newspaper, href: '/admin/news', color: 'text-blue-400' },
    { label: 'ผู้เล่นที่ active', value: playerCount ?? 0, icon: Users, href: '/admin/players', color: 'text-green-400' },
    { label: 'แมตช์ทั้งหมด', value: matchCount ?? 0, icon: Calendar, href: '/admin/matches', color: 'text-[#C9A84C]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">Dashboard</h1>
        <p className="text-gray-500 font-heading text-sm mt-1">ภาพรวมข้อมูลสโมสร</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {STATS.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-5 hover:border-[#B91C1C]/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} className={color} />
              <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="font-display text-4xl text-white">{value}</p>
            <p className="text-xs text-gray-500 font-heading mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent news */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-heading font-semibold text-white text-sm">ข่าวล่าสุด</h2>
            <Link href="/admin/news" className="text-xs text-[#C9A84C] hover:underline font-heading">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {recentNews?.map((n) => (
              <Link
                key={n.id}
                href={`/admin/news/${n.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#1E1E1E] transition-colors"
              >
                <p className="text-sm text-gray-300 font-heading truncate flex-1 mr-3">{n.title}</p>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {new Date(n.published_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            ))}
            {(!recentNews || recentNews.length === 0) && (
              <p className="px-5 py-4 text-sm text-gray-600">ยังไม่มีข่าว</p>
            )}
          </div>
        </div>

        {/* Upcoming matches */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-heading font-semibold text-white text-sm">แมตช์ที่กำลังจะมา</h2>
            <Link href="/admin/matches" className="text-xs text-[#C9A84C] hover:underline font-heading">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {upcomingMatches?.map((m) => (
              <Link
                key={m.id}
                href={`/admin/matches/${m.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#1E1E1E] transition-colors"
              >
                <div>
                  <p className="text-sm text-gray-300 font-heading">
                    {m.is_home ? 'KKU' : m.opponent} vs {m.is_home ? m.opponent : 'KKU'}
                  </p>
                  <p className="text-xs text-gray-600">{m.competition}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(m.match_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            ))}
            {(!upcomingMatches || upcomingMatches.length === 0) && (
              <p className="px-5 py-4 text-sm text-gray-600">ไม่มีแมตช์ที่กำลังจะมา</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
