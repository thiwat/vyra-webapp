import { useRequest } from 'ahooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { requestList } from '@/apis/client/entity'
import { useOverviewStateValue } from '@/atoms/overview'
import BotHeatmap from '@/components/business/bot/BotHeatmap'
import ActivePosition from '@/components/business/trading/ActivePosition'
import Panel, { EmptyState } from '@/components/business/trading/Panel'
import Stat from '@/components/business/trading/Stat'
import TradeCalendar from '@/components/business/trading/TradeCalendar'
import TradeTable from '@/components/business/trading/TradeTable'
import { Entity } from '@/enums/entity'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

// Bots act once an hour, so a slow refresh is enough.
const BOTS_POLL_MS = 30000

/** View-only: bots and positions. Stop bot lives on the bot page; Emergency close stays here. */
const DashboardPage = () => {
  const router = useRouter()
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
  const { data: bots } = useRequest(
    () =>
      requestList({
        entity: Entity.bot,
        filter: { connector_id: connectorId },
        sort: 'created_at',
        page: 1,
        page_size: 50
      }),
    { ready: !!connectorId, refreshDeps: [connectorId], pollingInterval: BOTS_POLL_MS }
  )
  if (!data) return null

  // Bots size from their own capital, so this shows the real balance, not the manual-trading cap.
  const equity = data.account?.wallet_balance ?? data.rules.equity

  return (
    <div className={'grid gap-3.5 min-w-0'}>
      <Panel
        title={t('menu_bots')}
        action={
          <Link href={'/bots'} className={'paragraph-small hover:!text-font-dark'}>
            {t('bot_manage')}
          </Link>
        }
      >
        {bots?.rows?.length ? (
          <BotHeatmap rows={bots.rows} onTileClick={bot => router.push(`/bots/${bot.id}`)} />
        ) : (
          <EmptyState title={t('bot_empty')} detail={t('bot_empty_detail')} />
        )}
      </Panel>
      <div className={'grid grid-cols-1 lg:grid-cols-5 gap-3.5 items-start'}>
        <div className={'lg:col-span-2 min-w-0'}>
          <TradeCalendar />
        </div>
        <div className={'lg:col-span-3 grid gap-3.5 min-w-0'}>
          <Stat
            label={t('dashboard_equity')}
            value={formatAmount(equity)}
            sub={t('dashboard_equity_sub')}
          />
          <ActivePosition />
          <Panel title={t('dashboard_recent')}>
            <TradeTable rows={recent?.rows || []} onNoteSaved={refresh} />
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
