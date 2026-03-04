import { createClient } from '@/lib/supabase/server'
import PlayerCard from '@/components/team/PlayerCard'
import { Player } from '@/lib/supabase/types'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'ทีม' }

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'] as const
const POSITION_LABEL: Record<string, string> = {
  GK: 'ผู้รักษาประตู',
  DEF: 'กองหลัง',
  MID: 'กองกลาง',
  FWD: 'กองหน้า',
}

export default async function TeamPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const byPosition = (pos: string) =>
    (players ?? []).filter((p: Player) => p.position === pos)

  const staff = (players ?? []).filter((p: Player) => p.position === 'STAFF')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-2">
          ฤดูกาล 2025/26
        </p>
        <h1 className="font-display text-5xl text-white">ทีม</h1>
      </div>

      {/* Players by position */}
      {POSITIONS.map((pos) => {
        const group = byPosition(pos)
        if (group.length === 0) return null
        return (
          <section key={pos} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#B91C1C]" />
              <h2 className="font-heading font-semibold text-white text-lg tracking-wide">
                {POSITION_LABEL[pos]}
              </h2>
              <span className="text-xs text-gray-600 font-heading">({group.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {group.map((player: Player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Staff */}
      {staff.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#C9A84C]" />
            <h2 className="font-heading font-semibold text-white text-lg tracking-wide">
              สตาฟโค้ช
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {staff.map((s: Player) => (
              <PlayerCard key={s.id} player={s} />
            ))}
          </div>
        </section>
      )}

      {(!players || players.length === 0) && (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-4xl">ยังไม่มีข้อมูลผู้เล่น</p>
        </div>
      )}
    </div>
  )
}
