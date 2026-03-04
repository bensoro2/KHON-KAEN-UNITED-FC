import { createClient } from '@/lib/supabase/server'
import NewsForm from '@/components/admin/forms/NewsForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let news = null
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('news').select('*').eq('id', id).single()
    news = data
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl text-white mb-8">
        {isNew ? 'เพิ่มข่าว' : 'แก้ไขข่าว'}
      </h1>
      <NewsForm news={news} />
    </div>
  )
}
