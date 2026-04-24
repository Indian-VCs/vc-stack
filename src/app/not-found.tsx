import PageLayout from '@/components/layout/PageLayout'
import NotFoundContent from '@/components/ui/NotFoundContent'

export const metadata = {
  title: '404 · Page Not Found',
}

export default function NotFound() {
  return (
    <PageLayout>
      <NotFoundContent />
    </PageLayout>
  )
}
