import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('news').select('title, excerpt').eq('slug', slug).single()
  return {
    title: data?.title ?? 'ข่าว',
    description: data?.excerpt ?? undefined,
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  club: 'สโมสร',
  team: 'ทีม',
  youth: 'เยาวชน',
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: news } = await supabase.from('news').select('*').eq('slug', slug).single()
  if (!news) notFound()

  return (
    <article className="min-h-screen pt-20 pb-16">
      {/* Cover image */}
      {news.cover_url && (
        <div className="relative h-[50vh] max-h-[480px] bg-[#0A0A0A]">
          <Image
            src={news.cover_url}
            alt={news.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Back */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-8 mb-6"
        >
          <ArrowLeft size={14} /> กลับหน้าข่าว
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-[#B91C1C] text-white text-xs font-heading font-semibold rounded-sm">
            {CATEGORY_LABEL[news.category] ?? news.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(news.published_at).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-bold text-white text-3xl sm:text-4xl leading-tight mb-6">
          {news.title}
        </h1>

        {/* Excerpt */}
        {news.excerpt && (
          <p className="text-lg text-gray-300 border-l-4 border-[#C9A84C] pl-4 mb-8 leading-relaxed">
            {news.excerpt}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-[#2A2A2A] mb-8" />

        {/* Content */}
        {news.content ? (
          <div
            className="prose-dark leading-relaxed space-y-4 text-gray-300 [&_h1]:font-heading [&_h1]:text-white [&_h1]:text-2xl [&_h2]:font-heading [&_h2]:text-white [&_h2]:text-xl [&_h3]:font-heading [&_h3]:text-white [&_strong]:text-white [&_a]:text-[#C9A84C] [&_img]:rounded-sm [&_img]:w-full"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        ) : (
          <p className="text-gray-500">ยังไม่มีเนื้อหา</p>
        )}
      </div>
    </article>
  )
}
