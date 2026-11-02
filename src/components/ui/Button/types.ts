import { IconName } from '../Icon/types'

export type ButtonProps = {
  type?: 'primary' | 'secondary' | 'default' | 'danger' | 'danger_primary' | 'long' | 'short'
  icon?: IconName | string
  size?: 'small' | 'default'
  /** Render as an underlined text link (keeps `type` colors). */
  link?: boolean
  className?: string
  htmlType?: 'submit' | 'button' | 'reset'
  children?: React.ReactNode
  disabled?: boolean
  tabIndex?: number
  setRef?: React.Ref<HTMLButtonElement>
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
}
