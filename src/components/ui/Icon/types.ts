import type { IconProps } from '@phosphor-icons/react'
import * as PhosphorIcons from '@phosphor-icons/react'

export type IconName = keyof typeof PhosphorIcons

export type PhosphorIconProps = IconProps & {
  name: IconName
  className?: string
}
