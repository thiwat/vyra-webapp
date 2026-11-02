import Icon from '@/components/ui/Icon'
import { CheckboxProps } from './types'

const Checkbox = ({ disabled, label, value = false, onChange }: CheckboxProps) => {
  const _onChange = e => {
    e.stopPropagation()
    e.preventDefault()
    if (disabled) return
    onChange && onChange(!value)
  }

  const borderClass = value ? 'border-primary bg-primary' : 'border-line bg-plane'

  const statusClass = disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'

  return (
    <div
      role={'checkbox'}
      aria-checked={!!value}
      className={`flex flex-row items-center ${statusClass}`}
      onClick={_onChange}
    >
      <div
        className={`h-5 w-5 min-w-5 flex items-center justify-center rounded border ${borderClass}`}
      >
        {value && <Icon name={'Check'} size={16} weight={'bold'} className={'text-white'} />}
      </div>
      {!!label && <div className={'body-base ml-2'}>{label}</div>}
    </div>
  )
}

export default Checkbox
