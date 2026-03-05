import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7F1D1D] via-[#1A0A0A] to-[#0A0A0A]" />
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #C9A84C 0px,
            #C9A84C 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.25)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-[#C9A84C]/40 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-heading tracking-widest uppercase">
          Thai League 2025/26
        </div>

        {/* Club name */}
        <h1 className="font-display text-6xl sm:text-8xl lg:text-[120px] text-white leading-none mb-2 tracking-wide drop-shadow-2xl">
          KHON KAEN
        </h1>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-8xl text-[#C9A84C] leading-none tracking-widest drop-shadow-xl">
          UNITED FC
        </h2>

        {/* Tagline */}
        <p className="mt-6 text-gray-300 text-lg font-heading tracking-wide">
          จงอางผยอง — The Cobra Strike
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/fixtures"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-heading font-semibold tracking-wide rounded-sm transition-colors"
          >
            ดูตารางแข่ง
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-heading font-semibold tracking-wide rounded-sm transition-colors"
          >
            เกี่ยวกับสโมสร
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9A84C]/50" />
      </div>
    </section>
  )
}
