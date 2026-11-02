import _isNumber from 'lodash/isNumber'
import { StatProps } from './types'

const meterClass = (value: number) =>
  value >= 90 ? 'bg-error' : value >= 60 ? 'bg-warning' : 'bg-font-dark'

const Stat = ({ label, value, valueClassName, meter, sub }: StatProps) => {
  return (
    <div className={'bg-card border border-line rounded-md px-3.5 py-3'}>
      <div className={'tagline-small'}>{label}</div>
      <div className={`num text-[22px] leading-tight my-1 ${valueClassName || '!text-font-dark'}`}>
        {value}
      </div>
      {_isNumber(meter) && (
        <div className={'h-[3px] bg-line rounded overflow-hidden mb-1.5'}>
          <div
            className={`h-full transition-all ${meterClass(meter)}`}
            style={{ width: `${Math.min(100, Math.max(0, meter))}%` }}
          />
        </div>
      )}
      {!!sub && <div className={'tagline-small'}>{sub}</div>}
    </div>
  )
}

export default Stat
