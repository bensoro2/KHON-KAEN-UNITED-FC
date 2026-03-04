import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import Image from 'next/image'
import { Product } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'ร้านค้า' }

export default async function ShopPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: settings }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('club_settings')
      .select('value')
      .eq('key', 'shop_email')
      .single(),
  ])

  const shopEmail = (settings as { value: string } | null)?.value ?? 'shop@kkufc.com'

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-xs text-[#C9A84C] font-heading tracking-widest uppercase mb-2">
          Khon Kaen United
        </p>
        <h1 className="font-display text-5xl text-white">ร้านค้าอย่างเป็นทางการ</h1>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products as Product[]).map((product) => (
            <div
              key={product.id}
              className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:border-[#B91C1C]/50 transition-colors group cursor-pointer"
            >
              {/* Product image */}
              <div className="aspect-square bg-gradient-to-br from-[#1E1E1E] to-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-5xl opacity-20">👕</span>
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-[#B91C1C] text-white text-xs font-heading rounded-sm z-10">
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-gray-500 font-heading mb-1">{product.category}</p>
                <p className="font-heading font-semibold text-white text-sm group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {product.name}
                </p>
                <p className="font-display text-xl text-[#C9A84C] mt-2">
                  ฿{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-4xl mb-2">ยังไม่มีสินค้า</p>
          <p className="text-sm">ติดตามได้เร็วๆ นี้</p>
        </div>
      )}

      {/* Contact banner */}
      <div className="mt-12 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 text-center">
        <p className="text-gray-400 font-heading mb-3">
          สั่งซื้อสินค้าออนไลน์หรือติดต่อสโมสรโดยตรง
        </p>
        <a
          href={`mailto:${shopEmail}`}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
        >
          ติดต่อสั่งซื้อ
        </a>
      </div>
    </div>
  )
}
