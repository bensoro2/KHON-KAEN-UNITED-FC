'use client'

import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  id: string
  table: string
}

export default function DeleteButton({ id, table }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('ต้องการลบรายการนี้?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from(table).delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-sm transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  )
}
