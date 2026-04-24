import { isAuthenticated } from '@/lib/auth'
import AdminSidebar from './AdminSidebar'

export const metadata = {
  title: { template: '%s | Admin – IndianVCs', default: 'Admin' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware protects /admin/* except /admin/login.
  // If unauthenticated here, we must be on /admin/login → render standalone.
  const authed = await isAuthenticated()
  if (!authed) return <>{children}</>

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ background: 'var(--paper)' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}
