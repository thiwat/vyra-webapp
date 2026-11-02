import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { MENU } from '@/constants/menu'

/** Mobile drawer open state + page title derived from constants/menu. */
const useHeader = () => {
  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)

  const onToggleOpen = () => setOpen(prev => !prev)

  const title = useMemo(() => {
    const parent = MENU.find(i =>
      i.href == '/' ? router.pathname == i.href : router.pathname.startsWith(i.href)
    )

    const child = (parent?.children || []).find(i => router.pathname.startsWith(i.href))

    return child?.label || parent?.label
  }, [router.pathname])

  return {
    open,
    title,
    onToggleOpen
  }
}

export default useHeader
