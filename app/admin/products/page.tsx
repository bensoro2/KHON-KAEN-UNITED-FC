import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white">สินค้า</h1>
          <p className="text-gray-500 font-heading text-sm mt-1">{products?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          <Plus size={16} /> เพิ่มสินค้า
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-[#1E1E1E] border-b border-[#2A2A2A] text-xs text-gray-500 font-heading uppercase tracking-wider">
          <span>รูป</span>
          <span>ชื่อสินค้า</span>
          <span>หมวด</span>
          <span>ราคา</span>
          <span>สถานะ</span>
          <span>จัดการ</span>
        </div>
        {products?.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-[#2A2A2A] last:border-b-0 items-center hover:bg-[#1A1A1A] transition-colors"
          >
            <div className="w-10 h-10 relative rounded-sm overflow-hidden bg-[#1E1E1E] flex-shrink-0">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">👕</div>
              )}
            </div>
            <div>
              <p className="text-sm text-white font-heading">{p.name}</p>
              {p.badge && (
                <span className="text-xs text-[#B91C1C]">{p.badge}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{p.category}</span>
            <span className="font-display text-base text-[#C9A84C]">฿{p.price.toLocaleString()}</span>
            <span className={`text-xs font-heading ${p.is_active ? 'text-green-400' : 'text-gray-600'}`}>
              {p.is_active ? 'แสดง' : 'ซ่อน'}
            </span>
            <div className="flex items-center gap-2">
              <Link href={`/admin/products/${p.id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E1E1E] rounded-sm transition-colors">
                <Pencil size={14} />
              </Link>
              <DeleteButton id={p.id} table="products" />
            </div>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-gray-600">
            <p className="font-heading">ยังไม่มีสินค้า</p>
          </div>
        )}
      </div>
    </div>
  )
}
