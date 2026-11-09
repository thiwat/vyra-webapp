import { useOverviewStateValue } from '@/atoms/overview'
import { t } from '@/utils/translate'

/** Connection state. Bot status lives on the Dashboard and the Bots page. */
const StatusBar = () => {
  const { data, offline } = useOverviewStateValue()
  if (!data?.mode) return null

  const connected = data.connected && !offline

  return (
    <div className={'hidden xl:flex flex-row items-center gap-4'}>
      <span
        className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${connected ? 'bg-success/15 !text-success' : 'bg-error/15 !text-error'}`}
      >
        {`● ${t(connected ? 'trading_connected' : 'trading_disconnected')}`}
      </span>
    </div>
  )
}

export default StatusBar
