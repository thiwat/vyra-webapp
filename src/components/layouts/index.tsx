import { LayoutType } from '@/enums/layout'
import useLayout from '@/hooks/layout'
import LoginLayout from './Login'
import MainLayout from './Main'
import { LayoutProps } from './types'

/** Picks the layout by route (hooks/layout). Add new layouts to enums/layout + this switch. */
const Layout = ({ children }: LayoutProps) => {
  const { layout } = useLayout()

  if (layout == LayoutType.login) {
    return <LoginLayout>{children}</LoginLayout>
  }

  return <MainLayout>{children}</MainLayout>
}

export default Layout
