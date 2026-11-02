import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { requestList } from '@/apis/client/entity'
import Panel, { EmptyState } from '@/components/business/trading/Panel'
import Button from '@/components/ui/Button'
import ExchangeLogo from '@/components/ui/ExchangeLogo'
import Table from '@/components/ui/Table'
import { Entity } from '@/enums/entity'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

const ConnectorsPage = () => {
  const router = useRouter()
  const { data } = useRequest(() =>
    requestList({ entity: Entity.connector, sort: 'created_at', page: 1, page_size: 50 })
  )
  const rows = data?.rows || []

  return (
    <div className={'w-full max-w-[1100px] mx-auto'}>
      <Panel
        title={t('menu_connectors')}
        action={
          <div>
            <Button
              size={'small'}
              type={'primary'}
              onClick={() => router.push('/connectors/create')}
            >
              {t('connector_create')}
            </Button>
          </div>
        }
      >
        {rows.length ? (
          <Table
            data={rows}
            keyData={'id'}
            onRowClick={row => router.push(`/connectors/${row.id}`)}
            columns={[
              { label: t('connector_name'), keyData: 'name' },
              {
                label: t('connector_exchange'),
                keyData: 'exchange',
                renderer: row => (
                  <span className={'flex flex-row items-center gap-2'}>
                    <ExchangeLogo exchange={row.exchange} />
                    {t(`connector_exchange_${row.exchange}`)}
                  </span>
                )
              },
              {
                label: t('connector_market'),
                keyData: 'market',
                renderer: row => t(`connector_market_${row.market}`)
              },
              {
                label: t('connector_environment'),
                keyData: 'environment',
                renderer: row => (
                  <span className={row.environment == 'live' ? '!text-error' : ''}>
                    {t(`connector_env_${row.environment}`)}
                  </span>
                )
              },
              {
                label: t('connector_credential'),
                keyData: 'api_key_masked',
                renderer: row => <span className={'num'}>{row.api_key_masked}</span>
              },
              {
                label: t('connector_amount'),
                keyData: 'max_amount_usdt',
                align: 'right',
                renderer: row => (
                  <span className={'num'}>
                    {row.max_amount_usdt ? formatAmount(row.max_amount_usdt) : t('connector_full')}
                  </span>
                )
              },
              {
                label: t('positions_status'),
                keyData: 'is_active',
                align: 'right',
                renderer: row =>
                  row.is_active ? (
                    <span
                      className={'tagline-small px-1.5 py-0.5 rounded bg-success/15 !text-success'}
                    >
                      {t('connector_selected')}
                    </span>
                  ) : (
                    '-'
                  )
              }
            ]}
          />
        ) : (
          <EmptyState
            title={t('trading_alert_no_connector')}
            detail={t('connector_empty_detail')}
          />
        )}
      </Panel>
    </div>
  )
}

export default ConnectorsPage
