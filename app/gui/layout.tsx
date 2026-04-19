import { Header } from '@/components/gui/Header'
import { Footer } from '@/components/gui/Footer'

export default function GuiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-2xl mx-auto px-6 pb-12">
      <Header />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  )
}
