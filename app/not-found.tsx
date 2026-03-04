import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-[120px] text-[#B91C1C] leading-none opacity-20">404</p>
      <h1 className="font-display text-4xl text-white -mt-6 mb-3">ไม่พบหน้านี้</h1>
      <p className="text-gray-500 font-heading mb-8">หน้าที่คุณต้องการไม่มีอยู่ในระบบ</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-medium text-sm rounded-sm transition-colors"
      >
        กลับหน้าแรก
      </Link>
    </div>
  )
}
