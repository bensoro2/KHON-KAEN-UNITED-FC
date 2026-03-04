import { Match } from '@/lib/supabase/types'
import Image from 'next/image'

interface Props {
  match: Match | null
}

export default function LastResultCard({ match }: Props) {
  if (!match || match.home_score === null || match.away_score === null) {
    return (
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-8 text-center">
        <p className="text-gray-500 font-heading">ยังไม่มีผลการแข่งขัน</p>
      </div>
    )
  }

  const kkuScore = match.is_home ? match.home_score : match.away_score
  const oppScore = match.is_home ? match.away_score : match.home_score
  const result = kkuScore > oppScore ? 'W' : kkuScore < oppScore ? 'L' : 'D'
  const resultColor =
    result === 'W' ? 'text-green-400' : result === 'L' ? 'text-red-400' : 'text-yellow-400'
  const resultLabel =
    result === 'W' ? 'ชนะ' : result === 'L' ? 'แพ้' : 'เสมอ'

  const homeTeam = match.is_home ? 'KKU' : match.opponent
  const awayTeam = match.is_home ? match.opponent : 'KKU'

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
      <div className="bg-[#1E1E1E] px-4 py-2 flex items-center justify-between">
        <span className="font-heading text-xs font-semibold text-white tracking-widest uppercase">
          ผลล่าสุด
        </span>
        <span className="text-xs text-gray-400">{match.competition}</span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1 text-center">
            <div className="w-14 h-14 relative">
              {match.is_home ? (
                <Image src="/logo.png" alt="KKU" fill className="object-contain" />
              ) : match.opponent_logo ? (
                <Image src={match.opponent_logo} alt={match.opponent} fill className="object-contain" />
              ) : (
                <div className="w-14 h-14 bg-[#1E1E1E] rounded-full" />
              )}
            </div>
            <p className="font-heading text-xs text-white">{homeTeam}</p>
          </div>

          {/* Score */}
          <div className="text-center flex-shrink-0">
            <p className="font-display text-5xl text-white leading-none">
              {match.home_score} – {match.away_score}
            </p>
            <p className={`font-heading text-sm font-bold mt-1 ${resultColor}`}>
              {resultLabel}
            </p>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1 text-center">
            <div className="w-14 h-14 relative">
              {!match.is_home ? (
                <Image src="/logo.png" alt="KKU" fill className="object-contain" />
              ) : match.opponent_logo ? (
                <Image src={match.opponent_logo} alt={match.opponent} fill className="object-contain" />
              ) : (
                <div className="w-14 h-14 bg-[#1E1E1E] rounded-full" />
              )}
            </div>
            <p className="font-heading text-xs text-white">{awayTeam}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2A2A2A] text-center">
          <p className="text-xs text-gray-500">
            {new Date(match.match_date).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
