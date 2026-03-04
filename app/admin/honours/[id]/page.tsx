import { createClient } from '@/lib/supabase/server'
import HonourForm from '@/components/admin/forms/HonourForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminHonourEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let honour = null
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('honours').select('*').eq('id', id).single()
    honour = data
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl text-white mb-8">
        {isNew ? 'เพิ่มถ้วยรางวัล' : 'แก้ไขถ้วยรางวัล'}
      </h1>
      <HonourForm honour={honour} />
    </div>
  )
}
