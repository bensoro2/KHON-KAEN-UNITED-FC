'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Newspaper, Users, Calendar, BarChart3, Trophy, ShoppingBag, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',           label: 'Dashboard',     icon: LayoutDashboard, exact: true  },
  { href: '/admin/news',      label: 'ข่าวสาร',       icon: Newspaper,       exact: false },
  { href: '/admin/players',   label: 'ผู้เล่น',       icon: Users,           exact: false },
  { href: '/admin/matches',   label: 'แมตช์',         icon: Calendar,        exact: false },
  { href: '/admin/standings', label: 'ตารางคะแนน',   icon: BarChart3,        exact: false },
  { href: '/admin/honours',   label: 'ถ้วยรางวัล',   icon: Trophy,          exact: false },
  { href: '/admin/products',  label: 'สินค้า',        icon: ShoppingBag,     exact: false },
  { href: '/admin/settings',  label: 'ตั้งค่าสโมสร', icon: Settings,        exact: false },
]

interface Props {
  onClose: () => void
}

export default function AdminSidebar({ onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <aside className="w-60 h-full min-h-screen bg-[#0F0F0F] border-r border-[#2A2A2A] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#2A2A2A]">
        <div className="w-9 h-9 relative flex-shrink-0">
          <Image src="/logo.png" alt="KKU" fill className="object-contain" />
        </div>
        <div>
          <p className="font-display text-sm text-white leading-none">KHON KAEN</p>
          <p className="font-display text-[10px] text-[#C9A84C] tracking-widest">UNITED ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-heading font-medium transition-colors ${
                active
                  ? 'bg-[#B91C1C]/20 text-[#C9A84C] border-l-2 border-[#B91C1C]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#2A2A2A]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm font-heading font-medium text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
