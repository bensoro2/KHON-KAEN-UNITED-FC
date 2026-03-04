import { Match } from '@/lib/supabase/types'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const hasResult = match.home_score !== null && match.away_score !== null
  const kkuScore = match.is_home ? match.home_score : match.away_score
  const oppScore = match.is_home ? match.away_score : match.home_score

  let resultTag = null
  if (hasResult && kkuScore !== null && oppScore !== null) {
    if (kkuScore > oppScore) {
      resultTag = <span className="px-2 py-0.5 bg-green-900/40 text-green-400 text-xs font-heading rounded-sm">ชนะ</span>
    } else if (kkuScore < oppScore) {
      resultTag = <span className="px-2 py-0.5 bg-red-900/40 text-red-400 text-xs font-heading rounded-sm">แพ้</span>
    } else {
      resultTag = <span className="px-2 py-0.5 bg-yellow-900/40 text-yellow-400 text-xs font-heading rounded-sm">เสมอ</span>
    }
  }

  const homeTeam = match.is_home ? 'Khon Kaen United' : match.opponent
  const awayTeam = match.is_home ? match.opponent : 'Khon Kaen United'

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 hover:border-[#B91C1C]/30 transition-colors">
      {/* Top row: competition + result tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500 font-heading">{match.competition}</span>
        {resultTag}
        {!hasResult && (
          <span className="px-2 py-0.5 bg-[#1E1E1E] text-gray-400 text-xs font-heading rounded-sm">
            กำลังมา
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-1.5 flex-1 text-center min-w-0">
          <div className="w-12 h-12 relative flex-shrink-0">
            {match.is_home ? (
              <Image src="/logo.png" alt="KKU" fill className="object-contain" />
            ) : match.opponent_logo ? (
              <Image src={match.opponent_logo} alt={match.opponent} fill className="object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#1E1E1E] rounded-full" />
            )}
          </div>
          <p className="text-xs text-white font-heading truncate w-full">{homeTeam}</p>
        </div>

        {/* Score / VS */}
        <div className="text-center flex-shrink-0 w-20">
          {hasResult ? (
            <p className="font-display text-3xl text-white leading-none">
              {match.home_score} – {match.away_score}
            </p>
          ) : (
            <>
              <p className="font-display text-2xl text-[#C9A84C]">VS</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(match.match_date).toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} น.
              </p>
            </>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1.5 flex-1 text-center min-w-0">
          <div className="w-12 h-12 relative flex-shrink-0">
            {!match.is_home ? (
              <Image src="/logo.png" alt="KKU" fill className="object-contain" />
            ) : match.opponent_logo ? (
              <Image src={match.opponent_logo} alt={match.opponent} fill className="object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#1E1E1E] rounded-full" />
            )}
          </div>
          <p className="text-xs text-white font-heading truncate w-full">{awayTeam}</p>
        </div>
      </div>

      {/* Date + Venue */}
      <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={11} className="text-[#C9A84C]" />
          <span>
            {new Date(match.match_date).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} className="text-[#C9A84C]" />
            <span>{match.venue}</span>
          </div>
        )}
      </div>
    </div>
  )
}
