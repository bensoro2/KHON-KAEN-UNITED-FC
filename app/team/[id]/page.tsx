import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('players').select('name, name_th').eq('id', id).single()
  return { title: data?.name_th || data?.name || 'ผู้เล่น' }
}

const POSITION_LABEL: Record<string, string> = {
  GK: 'ผู้รักษาประตู',
  DEF: 'กองหลัง',
  MID: 'กองกลาง',
  FWD: 'กองหน้า',
  STAFF: 'สตาฟโค้ช',
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: player } = await supabase.from('players').select('*').eq('id', id).single()
  if (!player) notFound()

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-8 mb-8"
        >
          <ArrowLeft size={14} /> กลับหน้าทีม
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10">
          {/* Photo */}
          <div>
            <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1E1E1E] to-[#0A0A0A] rounded-sm overflow-hidden border border-[#2A2A2A]">
              {player.image_url ? (
                <Image
                  src={player.image_url}
                  alt={player.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-6xl">
                  👤
                </div>
              )}
              {player.number !== null && (
                <div className="absolute top-4 right-4 w-12 h-12 bg-[#B91C1C] flex items-center justify-center">
                  <span className="font-display text-white text-2xl">{player.number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-[#1E1E1E] border border-[#2A2A2A] text-[#C9A84C] text-xs font-heading rounded-sm">
                {POSITION_LABEL[player.position]}
              </span>
              {player.nationality && (
                <span className="text-xs text-gray-500">{player.nationality}</span>
              )}
            </div>

            {player.name_th && (
              <h1 className="font-display text-5xl text-white mb-1">{player.name_th}</h1>
            )}
            <h2 className={`font-heading font-semibold text-gray-400 ${player.name_th ? 'text-xl' : 'font-display text-5xl text-white'}`}>
              {player.name}
            </h2>

            {/* Divider */}
            <div className="h-px bg-[#2A2A2A] my-6" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {player.number !== null && (
                <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 text-center">
                  <p className="font-display text-3xl text-[#C9A84C]">{player.number}</p>
                  <p className="text-xs text-gray-500 font-heading mt-1">เบอร์</p>
                </div>
              )}
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 text-center">
                <p className="font-heading font-semibold text-white text-sm">{POSITION_LABEL[player.position]}</p>
                <p className="text-xs text-gray-500 font-heading mt-1">ตำแหน่ง</p>
              </div>
              {player.nationality && (
                <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 text-center">
                  <p className="font-heading font-semibold text-white text-sm">{player.nationality}</p>
                  <p className="text-xs text-gray-500 font-heading mt-1">สัญชาติ</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {player.bio && (
              <div>
                <h3 className="font-heading font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                  ประวัติ
                </h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{player.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
