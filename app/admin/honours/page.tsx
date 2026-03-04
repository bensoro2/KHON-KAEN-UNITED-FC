import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminHonoursPage() {
  const supabase = await createClient()
  const { data: honours } = await supabase
    .from('honours')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white">ถ้วยรางวัล</h1>
          <p className="text-gray-500 font-heading text-sm mt-1">{honours?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/admin/honours/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          <Plus size={16} /> เพิ่มรางวัล
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_60px_auto] gap-4 px-5 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading uppercase tracking-wider">
          <span>ปี</span>
          <span>ชื่อรางวัล</span>
          <span>ลำดับ</span>
          <span>จัดการ</span>
        </div>
        {honours?.map((h) => (
          <div
            key={h.id}
            className="grid grid-cols-[80px_1fr_60px_auto] gap-4 px-5 py-3.5 border-b border-[#2A2A2A] last:border-b-0 items-center hover:bg-[#1A1A1A] transition-colors"
          >
            <span className="font-display text-xl text-[#C9A84C]">{h.year}</span>
            <span className="text-sm text-white font-heading">{h.title}</span>
            <span className="text-xs text-gray-500 text-center">{h.sort_order}</span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/honours/${h.id}`}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E1E1E] rounded-sm transition-colors"
              >
                <Pencil size={14} />
              </Link>
              <DeleteButton id={h.id} table="honours" />
            </div>
          </div>
        ))}
        {(!honours || honours.length === 0) && (
          <div className="text-center py-12 text-gray-600">
            <p className="font-heading">ยังไม่มีถ้วยรางวัล</p>
          </div>
        )}
      </div>
    </div>
  )
}
