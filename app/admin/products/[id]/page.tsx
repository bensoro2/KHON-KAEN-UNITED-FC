import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/forms/ProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let product = null
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    product = data
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl text-white mb-8">
        {isNew ? 'เพิ่มสินค้า' : 'แก้ไขสินค้า'}
      </h1>
      <ProductForm product={product} />
    </div>
  )
}
