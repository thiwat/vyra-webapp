import { SwitchProps } from './types'

const Switch = ({ value, disabled, onChange }: SwitchProps) => {
  const styleClass = value ? 'bg-primary' : 'bg-line'

  const disableClass = disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'

  const onClick = () => {
    if (disabled) return
    onChange?.(!value)
  }

  return (
    <div className={'flex flex-row items-center h-[34px]'}>
      <div
        role={'switch'}
        aria-checked={!!value}
        onClick={onClick}
        className={`flex flex-row items-center relative rounded-full h-[24px] w-[48px] px-[2px] ${styleClass} ${disableClass}`}
      >
        <div
          className={'h-[20px] w-[20px] rounded-full bg-white shadow transition-all absolute'}
          style={{ left: value ? 26 : 2 }}
        />
      </div>
    </div>
  )
}

export default Switch
