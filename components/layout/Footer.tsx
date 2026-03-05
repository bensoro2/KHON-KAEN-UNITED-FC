import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const QUICK_LINKS = [
  { href: '/news', label: 'ข่าวสาร' },
  { href: '/team', label: 'ทีม' },
  { href: '/fixtures', label: 'ตารางแข่ง' },
  { href: '/standings', label: 'ตารางคะแนน' },
  { href: '/about', label: 'เกี่ยวกับสโมสร' },
]

const SOCIAL = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Twitter, label: 'X (Twitter)' },
  { href: '#', icon: Youtube, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image src="/logo.png" alt="Khon Kaen United" fill className="object-contain" />
              </div>
              <div>
                <p className="font-display text-2xl text-white leading-none">KHON KAEN</p>
                <p className="font-display text-sm text-[#C9A84C] tracking-widest">UNITED FC</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              สโมสรฟุตบอลขอนแก่น ยูไนเต็ด<br />
              ร่วมเป็นส่วนหนึ่งของจงอางผยอง
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1E1E1E] text-gray-400 hover:bg-[#B91C1C] hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 tracking-wide">
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 tracking-wide">
              ติดต่อสโมสร
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>สนามกีฬากลาง จังหวัดขอนแก่น</li>
              <li>ขอนแก่น 40000</li>
              <li className="mt-3">
                <a href="mailto:info@kkufc.com" className="hover:text-[#C9A84C] transition-colors">
                  info@kkufc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Khon Kaen United FC. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-xs text-gray-700 hover:text-gray-500 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
