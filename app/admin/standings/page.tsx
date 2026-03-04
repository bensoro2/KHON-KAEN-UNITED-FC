import { createClient } from '@/lib/supabase/server'
import StandingsAdminClient from '@/components/admin/StandingsAdminClient'

export default async function AdminStandingsPage() {
  const supabase = await createClient()
  const { data: standings } = await supabase
    .from('standings')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">ตารางคะแนน</h1>
        <p className="text-gray-500 font-heading text-sm mt-1">จัดการตารางคะแนนลีก</p>
      </div>
      <StandingsAdminClient initialData={standings ?? []} />
    </div>
  )
}
