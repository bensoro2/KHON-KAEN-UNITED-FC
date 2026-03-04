import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

const POS_LABEL: Record<string, string> = {
  GK: 'GK', DEF: 'DEF', MID: 'MID', FWD: 'FWD', STAFF: 'STAFF',
}

export default async function AdminPlayersPage() {
  const supabase = await createClient()
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white">ผู้เล่น</h1>
          <p className="text-gray-500 font-heading text-sm mt-1">{players?.length ?? 0} คน</p>
        </div>
        <Link
          href="/admin/players/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          <Plus size={16} /> เพิ่มผู้เล่น
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading uppercase tracking-wider">
          <span>รูป</span>
          <span>ชื่อ</span>
          <span>เบอร์</span>
          <span>ตำแหน่ง</span>
          <span>จัดการ</span>
        </div>
        {players?.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#2A2A2A] last:border-b-0 items-center hover:bg-[#1A1A1A] transition-colors"
          >
            <div className="w-10 h-10 relative rounded-sm overflow-hidden bg-[#1E1E1E] flex-shrink-0">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill className="object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">👤</div>
              )}
            </div>
            <div>
              <p className="text-sm text-white font-heading">{p.name_th || p.name}</p>
              {p.name_th && <p className="text-xs text-gray-600">{p.name}</p>}
            </div>
            <span className="text-sm text-[#C9A84C] font-display w-8 text-center">
              {p.number ?? '—'}
            </span>
            <span className="px-2 py-0.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 text-xs font-heading rounded-sm">
              {POS_LABEL[p.position]}
            </span>
            <div className="flex items-center gap-2">
              <Link href={`/admin/players/${p.id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E1E1E] rounded-sm transition-colors">
                <Pencil size={14} />
              </Link>
              <DeleteButton id={p.id} table="players" />
            </div>
          </div>
        ))}
        {(!players || players.length === 0) && (
          <div className="text-center py-12 text-gray-600">
            <p className="font-heading">ยังไม่มีผู้เล่น</p>
          </div>
        )}
      </div>
    </div>
  )
}
