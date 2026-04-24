import Navbar from './Navbar'
import Footer from './Footer'
import CommandK from '@/components/ui/CommandK'
import { getAllTools } from '@/lib/data'

interface PageLayoutProps {
  children: React.ReactNode
}

export default async function PageLayout({ children }: PageLayoutProps) {
  const tools = await getAllTools()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandK tools={tools} />
    </div>
  )
}
