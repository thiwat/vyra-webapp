import { useOverviewStateValue } from '@/atoms/overview'
import { EmptyState } from '@/components/business/trading/Panel'
import TradeTicket from '@/components/business/trading/TradeTicket'
import useScreenSize from '@/hooks/screen'
import { t } from '@/utils/translate'

const TerminalPage = () => {
  const { isMobile } = useScreenSize()
  const { data } = useOverviewStateValue()

  if (!data) return null

  if (!data.mode) {
    return (
      <EmptyState
        title={t('trading_alert_no_connector')}
        detail={t('trading_alert_no_connector_detail')}
      />
    )
  }

  if (isMobile) {
    return <EmptyState title={t('ticket_mobile')} detail={t('ticket_mobile_detail')} />
  }

  return (
    <div className={'flex flex-col h-[calc(100dvh-132px)] min-h-[640px]'}>
      <TradeTicket />
    </div>
  )
}

export default TerminalPage
