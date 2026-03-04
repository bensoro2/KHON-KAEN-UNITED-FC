import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

const CATEGORY_LABEL: Record<string, string> = {
  club: 'สโมสร', team: 'ทีม', youth: 'เยาวชน',
}

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news')
    .select('id, title, category, published_at, slug')
    .order('published_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white">ข่าวสาร</h1>
          <p className="text-gray-500 font-heading text-sm mt-1">{news?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          <Plus size={16} /> เพิ่มข่าว
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading uppercase tracking-wider">
          <span>หัวข้อ</span>
          <span>หมวด</span>
          <span>วันที่</span>
          <span>จัดการ</span>
        </div>
        {news?.map((n) => (
          <div
            key={n.id}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-[#2A2A2A] last:border-b-0 items-center hover:bg-[#1A1A1A] transition-colors"
          >
            <p className="text-sm text-white font-heading truncate">{n.title}</p>
            <span className="px-2 py-0.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 text-xs font-heading rounded-sm whitespace-nowrap">
              {CATEGORY_LABEL[n.category]}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(n.published_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/news/${n.id}`}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E1E1E] rounded-sm transition-colors"
              >
                <Pencil size={14} />
              </Link>
              <DeleteButton id={n.id} table="news" />
            </div>
          </div>
        ))}
        {(!news || news.length === 0) && (
          <div className="text-center py-12 text-gray-600">
            <p className="font-heading">ยังไม่มีข่าว</p>
          </div>
        )}
      </div>
    </div>
  )
}
