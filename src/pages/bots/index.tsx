import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { requestList } from '@/apis/client/entity'
import BotHeatmap from '@/components/business/bot/BotHeatmap'
import Panel, { EmptyState } from '@/components/business/trading/Panel'
import Button from '@/components/ui/Button'
import { Entity } from '@/enums/entity'
import { t } from '@/utils/translate'

// Bots act once an hour, so a slow refresh is enough.
const POLL_MS = 30000

const BotsPage = () => {
  const router = useRouter()
  const { data } = useRequest(
    () => requestList({ entity: Entity.bot, sort: 'created_at', page: 1, page_size: 50 }),
    { pollingInterval: POLL_MS }
  )
  const rows = data?.rows || []

  return (
    <div className={'w-full max-w-[1100px] mx-auto'}>
      <Panel
        title={t('menu_bots')}
        action={
          <div>
            <Button size={'small'} type={'primary'} onClick={() => router.push('/bots/create')}>
              {t('bot_create')}
            </Button>
          </div>
        }
      >
        {rows.length ? (
          <BotHeatmap rows={rows} onTileClick={bot => router.push(`/bots/${bot.id}`)} />
        ) : (
          <EmptyState title={t('bot_empty')} detail={t('bot_empty_detail')} />
        )}
      </Panel>
    </div>
  )
}

export default BotsPage
