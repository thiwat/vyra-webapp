import { SegmentedProps } from './types'

const Segmented = ({ value, options, disabled, small, onChange }: SegmentedProps) => {
  return (
    <div
      role={'group'}
      className={`flex flex-row gap-0.5 rounded p-0.5 ${small ? '' : 'bg-plane border border-line'}`}
    >
      {options.map(option => {
        const active = option.value == value
        const activeClass = active
          ? option.activeClassName || 'bg-line !text-font-dark'
          : 'hover:!text-font-dark'
        return (
          <button
            key={option.value}
            type={'button'}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange?.(option.value)}
            className={`flex-1 rounded-sm cursor-pointer tagline-medium disabled:cursor-not-allowed px-2 ${small ? 'h-[22px]' : 'h-[28px]'} ${activeClass}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default Segmented
