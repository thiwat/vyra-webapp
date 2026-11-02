import { LayoutProps } from '../types'
import AlertBanner from '@/components/business/trading/AlertBanner'
import useOverview from '@/services/overview'
import Header from './Header'
import PageHeader from './PageHeader'

/** Mobile-first shell: sticky header (drawer menu on mobile, inline menu on md+) + centered content. */
const MainLayout = ({ children }: LayoutProps) => {
  useOverview()

  return (
    <div id={'main-container'} className={'min-h-dvh w-full flex flex-col bg-plane'}>
      <Header />
      <AlertBanner />
      <main
        id={'main-layout-container'}
        className={'flex flex-1 flex-col w-full max-w-[1600px] mx-auto px-4 md:px-5 py-4'}
      >
        <PageHeader />
        <div className={'flex flex-1 flex-col'}>{children}</div>
      </main>
    </div>
  )
}

export default MainLayout
