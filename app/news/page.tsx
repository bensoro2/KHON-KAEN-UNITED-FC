import { createClient } from '@/lib/supabase/server'
import NewsCard from '@/components/news/NewsCard'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'ข่าวสาร' }

const CATEGORIES = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'club', label: 'สโมสร' },
  { value: 'team', label: 'ทีม' },
  { value: 'youth', label: 'เยาวชน' },
]

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function NewsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('news').select('*').order('published_at', { ascending: false })
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: news } = await query

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-2">
          อัปเดตล่าสุด
        </p>
        <h1 className="font-display text-5xl text-white">ข่าวสาร</h1>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const active = (category ?? 'all') === cat.value
          return (
            <a
              key={cat.value}
              href={cat.value === 'all' ? '/news' : `/news?category=${cat.value}`}
              className={`px-4 py-2 text-sm font-heading font-medium rounded-sm transition-colors ${
                active
                  ? 'bg-[#B91C1C] text-white'
                  : 'bg-[#1E1E1E] text-gray-400 hover:text-white border border-[#2A2A2A]'
              }`}
            >
              {cat.label}
            </a>
          )
        })}
      </div>

      {/* Grid */}
      {news && news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-4xl mb-2">ยังไม่มีข่าว</p>
          <p className="text-sm">ติดตามได้เร็วๆ นี้</p>
        </div>
      )}
    </div>
  )
}
