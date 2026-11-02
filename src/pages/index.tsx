import { useRequest } from 'ahooks'
import { requestList } from '@/apis/client/entity'
import { useOverviewStateValue } from '@/atoms/overview'
import ActivePosition from '@/components/business/trading/ActivePosition'
import Panel from '@/components/business/trading/Panel'
import Stat from '@/components/business/trading/Stat'
import TodayPanel from '@/components/business/trading/TodayPanel'
import TradeCalendar from '@/components/business/trading/TradeCalendar'
import TradeTable from '@/components/business/trading/TradeTable'
import { Entity } from '@/enums/entity'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

const DashboardPage = () => {
  const { data } = useOverviewStateValue()
  const connectorId = data?.connector_id
  const { data: recent, refresh } = useRequest(
    () =>
      requestList({
        entity: Entity.trade,
        filter: { connector_id: connectorId },
        sort: '-created_at',
        page: 1,
        page_size: 5
      }),
    { ready: !!connectorId, refreshDeps: [connectorId] }
  )
  if (!data) return null

  const equity = Math.min(data.rules.equity, data.account?.wallet_balance ?? data.rules.equity)

  return (
    <div className={'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-3.5 items-start'}>
      <div className={'grid gap-3.5 min-w-0'}>
        <TradeCalendar />
        <Panel title={t('dashboard_recent')}>
          <TradeTable rows={recent?.rows || []} onNoteSaved={refresh} />
        </Panel>
      </div>
      <div className={'grid gap-3.5'}>
        <Stat
          label={t('dashboard_equity')}
          value={formatAmount(equity)}
          sub={t('dashboard_equity_sub')}
        />
        <TodayPanel />
        <ActivePosition />
      </div>
    </div>
  )
}

export default DashboardPage
