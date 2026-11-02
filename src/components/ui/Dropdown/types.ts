import { IconName } from '../Icon/types'

export type DropdownOption = {
  label: React.ReactNode
  value: string
  icon?: IconName | string
}

export type DropdownProps = {
  alignment?: 'top-right' | 'bottom-left' | 'bottom-right'
  children: React.ReactNode
  options: DropdownOption[]
  onClick: (value: string) => void
}
