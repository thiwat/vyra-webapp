import * as PhosphorIcons from '@phosphor-icons/react'
import { FC } from 'react'
import { PhosphorIconProps } from './types'

/** Phosphor icon by name: <Icon name={'House'} size={20} weight={'fill'} /> (https://phosphoricons.com) */
const Icon = ({ name, size = 24, weight = 'regular', className, ...rest }: PhosphorIconProps) => {
  const PhosphorIcon = PhosphorIcons[name] as FC<any>

  if (!PhosphorIcon) {
    console.warn(`Icon "${name}" does not exist in Phosphor icons.`)
    return null
  }

  return <PhosphorIcon size={size} weight={weight} {...rest} className={className} />
}

export default Icon
