import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useProfileStateValue } from '@/atoms/profile'
import { HIDE_MENU, MENU } from '@/constants/menu'
import { prepareMenu } from '@/utils/menu'

const isMatch = (href: string, path: string) => {
  if (href == '/') return path == '/'
  return path == href || path.startsWith(`${href}/`)
}

const useMenu = () => {
  const router = useRouter()
  const profile = useProfileStateValue()

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const exists = MENU.find(i => isMatch(i.href, router.pathname))
    return exists ? [exists.href] : []
  })

  const getIsActive = (path: string): boolean => {
    return isMatch(path, router.pathname)
  }

  /** Toggle a parent item (with children) open/closed. */
  const onClick = (key: string) => {
    setOpenKeys(prev => (prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]))
  }

  const menu = useMemo(() => prepareMenu(MENU, profile), [profile])

  return {
    openKeys,
    menu,
    hideMenu: HIDE_MENU.includes(router.pathname),
    getIsActive,
    onClick
  }
}

export default useMenu
