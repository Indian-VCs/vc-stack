import Navbar from './Navbar'
import Footer from './Footer'
import CommandK, { type CommandKTool } from '@/components/ui/CommandK'
import { getAllTools } from '@/lib/data'

interface PageLayoutProps {
  children: React.ReactNode
}

export default async function PageLayout({ children }: PageLayoutProps) {
  const tools = await getAllTools()
  const searchTools: CommandKTool[] = tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    shortDesc: tool.shortDesc,
    categoryName: tool.category?.name ?? null,
    logoUrl: tool.logoUrl,
    websiteUrl: tool.websiteUrl,
    isFeatured: tool.isFeatured,
  }))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandK tools={searchTools} />
    </div>
  )
}
