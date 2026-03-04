'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Standing } from '@/lib/supabase/types'
import { Plus, Trash2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  initialData: Standing[]
}

const EMPTY_ROW = (): Omit<Standing, 'id'> => ({
  season: '2025',
  team_name: '',
  logo_url: null,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  gf: 0,
  ga: 0,
  points: 0,
  sort_order: 0,
})

export default function StandingsAdminClient({ initialData }: Props) {
  const [rows, setRows] = useState<(Standing | (Omit<Standing, 'id'> & { id?: string }))[]>(initialData)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  function addRow() {
    setRows([...rows, EMPTY_ROW()])
  }

  function updateRow(index: number, field: string, value: string | number) {
    setRows(rows.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }

  async function deleteRow(index: number) {
    const row = rows[index]
    if ((row as Standing).id) {
      const supabase = createClient()
      await supabase.from('standings').delete().eq('id', (row as Standing).id)
    }
    setRows(rows.filter((_, i) => i !== index))
  }

  async function saveAll() {
    setSaving(true)
    const supabase = createClient()

    for (const [i, row] of rows.entries()) {
      const payload = {
        season: row.season,
        team_name: row.team_name,
        logo_url: row.logo_url,
        played: Number(row.played),
        won: Number(row.won),
        drawn: Number(row.drawn),
        lost: Number(row.lost),
        gf: Number(row.gf),
        ga: Number(row.ga),
        points: Number(row.points),
        sort_order: i,
      }
      if ((row as Standing).id) {
        await supabase.from('standings').update(payload).eq('id', (row as Standing).id)
      } else {
        const { data } = await supabase.from('standings').insert([payload]).select().single()
        if (data) {
          rows[i] = data
        }
      }
    }

    setSaving(false)
    router.refresh()
  }

  const cellClass = "bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] w-full"
  const numCellClass = `${cellClass} text-center`

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#B91C1C] font-heading text-sm rounded-sm transition-colors"
        >
          <Plus size={14} /> เพิ่มทีม
        </button>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors"
        >
          <Save size={14} /> {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#1E1E1E] border-b border-[#2A2A2A]">
              {['#', 'ชื่อทีม', 'ซีซั่น', 'แข่ง', 'ชนะ', 'เสมอ', 'แพ้', 'GF', 'GA', 'คะแนน', ''].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs text-gray-500 font-heading uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {rows.map((row, i) => (
              <tr key={i} className="bg-[#141414] hover:bg-[#1A1A1A] transition-colors">
                <td className="px-3 py-2 text-gray-500 text-xs font-heading">{i + 1}</td>
                <td className="px-3 py-2 min-w-[160px]">
                  <input value={row.team_name} onChange={(e) => updateRow(i, 'team_name', e.target.value)} className={cellClass} placeholder="ชื่อทีม" />
                </td>
                <td className="px-3 py-2 w-20">
                  <input value={row.season} onChange={(e) => updateRow(i, 'season', e.target.value)} className={cellClass} placeholder="2025" />
                </td>
                {(['played','won','drawn','lost','gf','ga','points'] as const).map((field) => (
                  <td key={field} className="px-3 py-2 w-16">
                    <input
                      type="number"
                      min="0"
                      value={row[field]}
                      onChange={(e) => updateRow(i, field, parseInt(e.target.value) || 0)}
                      className={numCellClass}
                    />
                  </td>
                ))}
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteRow(i)}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-950/20 rounded-sm transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center py-8 text-gray-600 font-heading text-sm">ยังไม่มีข้อมูล กด "เพิ่มทีม" เพื่อเริ่ม</p>
        )}
      </div>
    </div>
  )
}
