import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'

export const metadata: Metadata = {
  title: {
    default: 'Khon Kaen United FC',
    template: '%s | Khon Kaen United FC',
  },
  description: 'เว็บไซต์อย่างเป็นทางการของสโมสรฟุตบอลขอนแก่น ยูไนเต็ด',
  keywords: ['Khon Kaen United', 'ขอนแก่น ยูไนเต็ด', 'ฟุตบอล', 'Thai League'],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'Khon Kaen United FC',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5] antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
