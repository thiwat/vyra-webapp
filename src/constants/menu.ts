import { IconName } from '@/components/ui/Icon/types'
import { t } from '@/utils/translate'

export type MenuProps = {
  label: string
  icon: IconName
  href: string
  children?: MenuProps[]
  /** Visible only to these roles. Omit = everyone. */
  roles?: string[]
}

/** Reached from the profile menu, not the top menu. */
export const ACCOUNT_MENU: MenuProps[] = [
  { label: t('menu_risk_rules'), icon: 'Shield', href: '/risk-rules' },
  { label: t('menu_connectors'), icon: 'Plugs', href: '/connectors' }
]

/** Pages that show a "back" link in the header instead of the page title. */
export const HIDE_MENU: string[] = []

export const MENU: MenuProps[] = [
  { label: t('menu_dashboard'), icon: 'House', href: '/' },
  { label: t('menu_bots'), icon: 'Robot', href: '/bots' },
  { label: t('menu_positions'), icon: 'Stack', href: '/positions' },
  { label: t('menu_journal'), icon: 'Notebook', href: '/journal' }
]
