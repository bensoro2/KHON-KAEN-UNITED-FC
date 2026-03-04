import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/admin/SettingsClient'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('club_settings')
    .select('*')
    .order('key', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">ตั้งค่าสโมสร</h1>
        <p className="text-gray-500 font-heading text-sm mt-1">ข้อมูลพื้นฐาน ประวัติ และช่องทางติดต่อ</p>
      </div>
      <SettingsClient initialSettings={settings ?? []} />
    </div>
  )
}
