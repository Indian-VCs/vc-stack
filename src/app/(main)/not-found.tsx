import NotFoundContent from '@/components/ui/NotFoundContent'

export const metadata = {
  title: '404 · Page Not Found',
  robots: { index: false, follow: true },
}

export default function MainNotFound() {
  return <NotFoundContent />
}
