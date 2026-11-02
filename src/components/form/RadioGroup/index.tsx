import { RadioGroupProps } from './types'

const RadioGroup = ({ mode = 'default', disabled, value, options, onChange }: RadioGroupProps) => {
  const onSelect = (newValue: string) => () => {
    if (disabled) return
    onChange?.(newValue)
  }

  const cursorClass = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'

  if (mode == 'normal') {
    return (
      <div className={'pt-1.5 grid grid-cols-2 md:grid-cols-3 gap-2'}>
        {options.map(i => {
          const className = value == i.value ? 'body-strong' : 'body-base'

          return (
            <div
              key={i.value}
              role={'radio'}
              aria-checked={value == i.value}
              className={`flex flex-row items-center ${cursorClass} ${className}`}
              onClick={onSelect(i.value)}
            >
              {value == i.value ? (
                <div
                  className={
                    'w-5 h-5 min-w-5 rounded-full border border-primary flex items-center justify-center'
                  }
                >
                  <div className={'w-3 h-3 bg-primary rounded-full'} />
                </div>
              ) : (
                <div className={'w-5 h-5 min-w-5 rounded-full border border-line'} />
              )}
              <span className={'ml-1.5'}>{i.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={
        'flex flex-row w-fit max-w-full overflow-x-auto no-scrollbar border border-line rounded-md bg-card'
      }
    >
      {options.map(i => {
        const className =
          value == i.value ? 'bg-primary !text-white body-strong' : 'bg-card body-base'

        return (
          <div
            key={i.value}
            role={'radio'}
            aria-checked={value == i.value}
            className={`min-w-[70px] whitespace-nowrap ${cursorClass} ${className} px-3 py-1 text-center`}
            onClick={onSelect(i.value)}
          >
            {i.label}
          </div>
        )
      })}
    </div>
  )
}

export default RadioGroup
