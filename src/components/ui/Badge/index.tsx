import { t } from '@/utils/translate'
import { BadgeProps } from './types'

const Badge = ({ color, value, trueLabel, falseLabel, type }: BadgeProps) => {
  if (type == 'boolean') {
    const colorClass = value ? 'bg-success' : 'bg-error'

    return (
      <div className={'flex flex-row items-center space-x-2'}>
        <div className={`h-3 w-3 mt-0.5 rounded-full ${colorClass}`} />
        <div className={'tagline-base leading-none'}>
          {value ? trueLabel || t('common_enable') : falseLabel || t('common_disable')}
        </div>
      </div>
    )
  }

  return (
    <div
      className={'px-2 py-1 w-fit rounded relative'}
      style={{
        border: `1px solid ${color}`
      }}
    >
      <div
        className={'items-center space-x-2 z-0 top-0 left-0 absolute w-full h-full rounded'}
        style={{
          backgroundColor: color,
          opacity: 0.2
        }}
      />
      <div className={'tagline-base leading-none relative z-[2]'} style={{ color }}>
        {value}
      </div>
    </div>
  )
}

export default Badge
