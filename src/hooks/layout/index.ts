import { useRouter } from 'next/router'
import { LOGIN_LAYOUT_PAGES } from '@/constants/auth'
import { LayoutType } from '@/enums/layout'

const useLayout = () => {
  const router = useRouter()

  const layout = LOGIN_LAYOUT_PAGES.includes(router.pathname) ? LayoutType.login : LayoutType.main

  return {
    layout
  }
}

export default useLayout
