import { News } from '@/lib/supabase/types'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORY_LABEL: Record<string, string> = {
  club: 'สโมสร',
  team: 'ทีม',
  youth: 'เยาวชน',
}

interface Props {
  news: News
}

export default function NewsCard({ news }: Props) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group block bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:border-[#B91C1C]/50 transition-colors"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] bg-[#1E1E1E] overflow-hidden">
        {news.cover_url ? (
          <Image
            src={news.cover_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#7F1D1D]/30 to-[#1A1A1A] flex items-center justify-center">
            <span className="text-4xl opacity-20">⚽</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#B91C1C] text-white text-xs font-heading font-semibold rounded-sm">
            {CATEGORY_LABEL[news.category] ?? news.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-2">
          {new Date(news.published_at).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <h3 className="font-heading font-semibold text-white text-base leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">{news.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
