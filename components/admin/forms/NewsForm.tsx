'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { News } from '@/lib/supabase/types'
import ImageUpload from '@/components/admin/ImageUpload'

interface Props {
  news: News | null
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function NewsForm({ news }: Props) {
  const isNew = !news
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: news?.title ?? '',
    slug: news?.slug ?? '',
    excerpt: news?.excerpt ?? '',
    content: news?.content ?? '',
    category: news?.category ?? 'club',
    cover_url: news?.cover_url ?? '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    }

    if (isNew) {
      await supabase.from('news').insert([payload])
    } else {
      await supabase.from('news').update(payload).eq('id', news!.id)
    }

    router.push('/admin/news')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">หัวข้อข่าว *</label>
        <input
          required
          value={form.title}
          onChange={(e) => {
            set('title', e.target.value)
            if (isNew) set('slug', slugify(e.target.value))
          }}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
          placeholder="ชื่อข่าว"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">Slug (URL)</label>
        <input
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors font-mono"
          placeholder="news-slug-url"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">หมวดหมู่</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
        >
          <option value="club">สโมสร</option>
          <option value="team">ทีม</option>
          <option value="youth">เยาวชน</option>
        </select>
      </div>

      {/* Cover image */}
      <ImageUpload
        label="รูปภาพ Cover"
        value={form.cover_url}
        onChange={(url) => set('cover_url', url)}
        bucket="uploads"
        folder="news"
        aspectRatio="video"
      />

      {/* Excerpt */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">สรุปย่อ</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          rows={3}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors resize-none"
          placeholder="สรุปเนื้อหาข่าวสั้นๆ"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">เนื้อหาข่าว (HTML)</label>
        <textarea
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          rows={14}
          className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors resize-y font-mono"
          placeholder="<p>เนื้อหาข่าว...</p>"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors"
        >
          {loading ? 'กำลังบันทึก...' : isNew ? 'เพิ่มข่าว' : 'บันทึก'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="px-6 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 hover:text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
