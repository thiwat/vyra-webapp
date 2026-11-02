import { DisplayProps } from './types'

/** Read-only value inside a FormItem. */
const Display = ({ value }: DisplayProps) => {
  return <div className={'body-base min-h-[34px] flex items-center'}>{value ?? '-'}</div>
}

export default Display
