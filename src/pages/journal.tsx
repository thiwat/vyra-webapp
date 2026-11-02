import Link from 'next/link'
import { useRouter } from 'next/router'
import { useOverviewStateValue } from '@/atoms/overview'
import Panel from '@/components/business/trading/Panel'
import TradeTable from '@/components/business/trading/TradeTable'
import TableFooter from '@/components/ui/Table/Footer'
import { Entity } from '@/enums/entity'
import useList from '@/services/list'
import { t } from '@/utils/translate'

const Journal = ({ connectorId, day }: { connectorId: string; day?: string }) => {
  const { data, sort, pageInfo, onSort, onChangePage, onChangePageSize, onRefresh } = useList({
    entity: Entity.trade,
    baseFilter: day
      ? { connector_id: connectorId, closed_day: day }
      : { connector_id: connectorId },
    defaultSort: '-created_at',
    defaultPageSize: 20
  })

  return (
    <Panel
      title={t('journal_history')}
      action={
        !!day && (
          <Link href={'/journal'} className={'tagline-small hover:!text-font-dark'}>
            {t('journal_clear_day', { day })}
          </Link>
        )
      }
    >
      <TradeTable rows={data || []} sort={sort} onSort={onSort} onNoteSaved={onRefresh} />
      <TableFooter
        pageInfo={pageInfo}
        onChangePage={onChangePage}
        onChangePageSize={onChangePageSize}
      />
    </Panel>
  )
}

const JournalPage = () => {
  const { data } = useOverviewStateValue()
  const day = useRouter().query.day as string
  return data?.connector_id ? (
    <Journal key={day || 'all'} connectorId={data.connector_id} day={day} />
  ) : null
}

export default JournalPage
