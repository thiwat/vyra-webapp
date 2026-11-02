import _cloneDeep from 'lodash/cloneDeep'
import { Profile } from '@/atoms/profile/types'
import { MenuProps } from '@/constants/menu'

/** Remove menu items whose `roles` do not include the current user's role (recursive). */
export const prepareMenu = (menu: MenuProps[], profile: Profile): MenuProps[] => {
  const res = []

  for (const i of menu) {
    const item = _cloneDeep(i)
    if (item.roles && !item.roles.includes(profile?.role)) continue
    if (item.children) item.children = prepareMenu(item.children, profile)
    res.push(item)
  }

  return res
}
