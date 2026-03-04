import { createClient } from '@/lib/supabase/server'
import PlayerForm from '@/components/admin/forms/PlayerForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminPlayerEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let player = null
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('players').select('*').eq('id', id).single()
    player = data
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl text-white mb-8">
        {isNew ? 'เพิ่มผู้เล่น' : 'แก้ไขผู้เล่น'}
      </h1>
      <PlayerForm player={player} />
    </div>
  )
}
