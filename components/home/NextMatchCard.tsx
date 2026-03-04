import { Match } from '@/lib/supabase/types'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('th-TH', { weekday: 'long' }),
    date: d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  }
}

interface Props {
  match: Match | null
}

export default function NextMatchCard({ match }: Props) {
  if (!match) {
    return (
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-8 text-center">
        <p className="text-gray-500 font-heading">ยังไม่มีแมตช์ที่กำหนด</p>
      </div>
    )
  }

  const { day, date, time } = formatDate(match.match_date)
  const home = match.is_home ? 'Khon Kaen United' : match.opponent
  const away = match.is_home ? match.opponent : 'Khon Kaen United'
  const homeLogo = match.is_home ? '/logo.png' : (match.opponent_logo || null)
  const awayLogo = match.is_home ? (match.opponent_logo || null) : '/logo.png'

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#B91C1C] px-4 py-2 flex items-center justify-between">
        <span className="font-heading text-xs font-semibold text-white tracking-widest uppercase">
          แมตช์ถัดไป
        </span>
        <span className="text-xs text-red-200">{match.competition}</span>
      </div>

      {/* Match info */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1 text-center">
            <div className="w-16 h-16 relative">
              {homeLogo ? (
                <Image src={homeLogo} alt={home} fill className="object-contain" />
              ) : (
                <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center text-2xl">⚽</div>
              )}
            </div>
            <p className="font-heading font-semibold text-white text-sm leading-tight">{home}</p>
          </div>

          {/* VS */}
          <div className="text-center flex-shrink-0">
            <p className="font-display text-3xl text-[#C9A84C]">VS</p>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1 text-center">
            <div className="w-16 h-16 relative">
              {awayLogo ? (
                <Image src={awayLogo} alt={away} fill className="object-contain" />
              ) : (
                <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center text-2xl">⚽</div>
              )}
            </div>
            <p className="font-heading font-semibold text-white text-sm leading-tight">{away}</p>
          </div>
        </div>

        {/* Date / Venue */}
        <div className="mt-5 pt-4 border-t border-[#2A2A2A] space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={12} className="text-[#C9A84C]" />
            <span>{day}, {date} · {time} น.</span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin size={12} className="text-[#C9A84C]" />
              <span>{match.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
