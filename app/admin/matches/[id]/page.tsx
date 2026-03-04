import { createClient } from '@/lib/supabase/server'
import MatchForm from '@/components/admin/forms/MatchForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminMatchEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let match = null
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('matches').select('*').eq('id', id).single()
    match = data
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl text-white mb-8">
        {isNew ? 'เพิ่มแมตช์' : 'แก้ไขแมตช์'}
      </h1>
      <MatchForm match={match} />
    </div>
  )
}
