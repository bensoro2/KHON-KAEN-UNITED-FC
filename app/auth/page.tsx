'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <Image src="/logo.png" alt="KKU" fill className="object-contain" />
          </div>
          <h1 className="font-display text-2xl text-white">ADMIN LOGIN</h1>
          <p className="text-xs text-gray-500 font-heading mt-1">Khon Kaen United FC</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-900 rounded-sm px-4 py-3 text-red-400 text-sm font-heading">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
              placeholder="admin@kkufc.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-heading uppercase tracking-wider mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B91C1C] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-heading font-semibold py-3 rounded-sm transition-colors tracking-wide"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}
