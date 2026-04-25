import type { Metadata } from 'next'
import { Suspense } from 'react'
import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  // If already signed in, bounce to the dashboard.
  if (await isAuthenticated()) redirect('/admin/dashboard')

  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : undefined

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--paper)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.24em',
              color: 'var(--red)',
              marginBottom: 4,
            }}
          >
            Indian VCs
          </div>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: '1.8rem',
              color: 'var(--ink)',
            }}
          >
            Admin · Sign in
          </div>
        </div>

        <Suspense>
          <LoginForm next={next} />
        </Suspense>
      </div>
    </div>
  )
}
