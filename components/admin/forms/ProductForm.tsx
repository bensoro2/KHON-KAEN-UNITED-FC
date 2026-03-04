'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/supabase/types'
import ImageUpload from '@/components/admin/ImageUpload'

interface Props {
  product: Product | null
}

export default function ProductForm({ product }: Props) {
  const isNew = !product
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    price: product?.price?.toString() ?? '',
    category: product?.category ?? '',
    image_url: product?.image_url ?? '',
    badge: product?.badge ?? '',
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order?.toString() ?? '0',
  })

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = {
      name: form.name,
      price: parseInt(form.price) || 0,
      category: form.category,
      image_url: form.image_url || null,
      badge: form.badge || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    }

    if (isNew) {
      await supabase.from('products').insert([payload])
    } else {
      await supabase.from('products').update(payload).eq('id', product!.id)
    }

    router.push('/admin/products')
    router.refresh()
  }

  const inputClass = "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ชื่อสินค้า *</label>
        <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="เสื้อเหย้า 2025/26" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ราคา (บาท) *</label>
          <input required type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} placeholder="1290" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">หมวดหมู่ *</label>
          <input required value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} placeholder="เสื้อแข่ง" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">Badge (เช่น ใหม่, ลด)</label>
          <input value={form.badge} onChange={(e) => set('badge', e.target.value)} className={inputClass} placeholder="ใหม่" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">ลำดับ</label>
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className={inputClass} placeholder="0" />
        </div>
      </div>

      <ImageUpload
        label="รูปสินค้า"
        value={form.image_url}
        onChange={(url) => set('image_url', url)}
        bucket="uploads"
        folder="products"
        aspectRatio="square"
      />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B91C1C]" />
        <label htmlFor="is_active" className="text-sm text-gray-400 font-heading">แสดงสินค้าในร้านค้า</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold text-sm rounded-sm transition-colors">
          {loading ? 'กำลังบันทึก...' : isNew ? 'เพิ่มสินค้า' : 'บันทึก'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2.5 bg-[#1E1E1E] border border-[#2A2A2A] text-gray-400 hover:text-white font-heading font-medium text-sm rounded-sm transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
