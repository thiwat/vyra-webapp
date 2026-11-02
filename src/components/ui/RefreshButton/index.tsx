import Icon from '../Icon'
import { RefreshButtonProps } from './types'

const RefreshButton = ({ onRefresh }: RefreshButtonProps) => {
  return (
    <button
      className={
        'outline-none cursor-pointer bg-card h-[34px] min-w-[34px] rounded shadow flex items-center justify-center hover:opacity-70'
      }
      type={'button'}
      onClick={onRefresh}
    >
      <Icon name={'ArrowCounterClockwise'} size={20} className={'text-icon'} />
    </button>
  )
}

export default RefreshButton
