import { Player } from '@/lib/supabase/types'
import Link from 'next/link'
import Image from 'next/image'

const POSITION_LABEL: Record<string, string> = {
  GK: 'ผู้รักษาประตู',
  DEF: 'กองหลัง',
  MID: 'กองกลาง',
  FWD: 'กองหน้า',
  STAFF: 'สตาฟ',
}

interface Props {
  player: Player
}

export default function PlayerCard({ player }: Props) {
  return (
    <Link
      href={`/team/${player.id}`}
      className="group block bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1E1E1E] to-[#0A0A0A] overflow-hidden">
        {player.image_url ? (
          <Image
            src={player.image_url}
            alt={player.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <div className="w-24 h-24 rounded-full bg-[#2A2A2A] flex items-center justify-center text-4xl text-gray-600">
              👤
            </div>
          </div>
        )}
        {/* Number badge */}
        {player.number !== null && (
          <div className="absolute top-3 right-3 w-9 h-9 bg-[#B91C1C] rounded-sm flex items-center justify-center">
            <span className="font-display text-white text-lg leading-none">{player.number}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#141414] to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3 border-t border-[#2A2A2A]">
        <p className="font-heading font-semibold text-white text-sm leading-tight group-hover:text-[#C9A84C] transition-colors">
          {player.name_th || player.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{POSITION_LABEL[player.position]}</p>
      </div>
    </Link>
  )
}
