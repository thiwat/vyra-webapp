import Link from 'next/link'
import { useRouter } from 'next/router'
import Panel, { InfoRow } from '@/components/business/trading/Panel'
import Form, { FormItem } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Segmented from '@/components/form/Segmented'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import ExchangeLogo from '@/components/ui/ExchangeLogo'
import Icon from '@/components/ui/Icon'
import { DEFAULT_CONNECTOR, EXCHANGE_OPTIONS, MARKET_OPTIONS } from '@/constants/exchange'
import useConnectorDetail from '@/services/connector_detail'
import { formatDatetime } from '@/utils/format'
import { formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'

const STATUS_CLASS = {
  connected: 'bg-success/15 !text-success',
  failed: 'bg-error/15 !text-error',
  untested: 'bg-line !text-font'
}

const ConnectorDetailPage = () => {
  const router = useRouter()
  const detail = useConnectorDetail(router.query.key as string)
  const { form, isCreate, connector, health } = detail
  const title = isCreate ? t('connector_create') : connector?.name
  const subtitle = connector
    ? `${t(`connector_exchange_${connector.exchange}`)} · ${t(`connector_market_${connector.market}`)} · ${t(`connector_env_${connector.environment}`)}`
    : t('connector_create_note')

  return (
    <div className={'w-full max-w-[1100px] mx-auto'}>
      <Link
        href={'/connectors'}
        className={'inline-flex flex-row items-center gap-1 paragraph-small hover:!text-font-dark'}
      >
        <Icon name={'ArrowLeft'} size={14} />
        {t('menu_connectors')}
      </Link>
      <div className={'flex flex-row items-center gap-3 mt-3 mb-4'}>
        <span className={'p-2.5 rounded-md bg-card border border-line'}>
          <ExchangeLogo exchange={connector?.exchange} size={26} />
        </span>
        <div className={'flex-1 min-w-0'}>
          <div className={'flex flex-row items-center gap-2'}>
            <h1 className={'header-bold !text-font-dark truncate'}>{title}</h1>
            <span className={`tagline-small px-1.5 py-0.5 rounded ${STATUS_CLASS[health.status]}`}>
              {t(`connector_status_${health.status}`)}
            </span>
          </div>
          <div className={'paragraph-small'}>{subtitle}</div>
        </div>
        <div>
          <Button disabled={detail.testing} onClick={detail.onTest}>
            {t('connector_test')}
          </Button>
        </div>
        <div>
          <Button type={'primary'} disabled={detail.saving} onClick={detail.onSave}>
            {t('trading_save')}
          </Button>
        </div>
        {!isCreate && !connector?.is_active && (
          <Dropdown
            alignment={'bottom-right'}
            options={[{ label: t('connector_delete'), value: 'delete', icon: 'Trash' }]}
            onClick={detail.onDelete}
          >
            <span
              aria-label={t('connector_more')}
              className={
                'flex items-center justify-center h-[34px] w-[34px] rounded-md border border-line'
              }
            >
              <Icon name={'DotsThreeVertical'} size={18} />
            </span>
          </Dropdown>
        )}
      </div>
      <div className={'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-3.5 items-start'}>
        <Panel title={t('connector_connection')}>
          <div className={'p-3.5'}>
            <Form
              form={form}
              name={'connector'}
              initialValues={DEFAULT_CONNECTOR}
              onFinish={detail.onSubmit}
            >
              <FormItem label={t('connector_name')} name={'name'} required>
                <Input />
              </FormItem>
              <div className={'grid grid-cols-2 gap-3'}>
                <FormItem label={t('connector_exchange')} name={'exchange'} required>
                  <Select disabled={!isCreate} options={EXCHANGE_OPTIONS} />
                </FormItem>
                <FormItem label={t('connector_market')} name={'market'} required>
                  <Select disabled={!isCreate} options={MARKET_OPTIONS} />
                </FormItem>
              </div>
              <FormItem label={t('connector_environment')} name={'environment'} required>
                <Segmented
                  disabled={!isCreate}
                  options={[
                    { label: t('connector_env_demo'), value: 'demo' },
                    { label: t('connector_env_live'), value: 'live' }
                  ]}
                />
              </FormItem>
              <div className={'mb-3'}>
                <div className={'body-strong !text-font-dark mb-1'}>{t('connector_base_url')}</div>
                <div
                  className={
                    'num h-[34px] flex items-center px-2 rounded border border-line bg-plane paragraph-small'
                  }
                >
                  {detail.baseUrl}
                </div>
                <div className={'paragraph-small mt-1'}>{t('connector_base_url_note')}</div>
              </div>
              <FormItem
                label={t('connector_api_key')}
                name={'api_key'}
                required={isCreate}
                description={isCreate ? undefined : connector?.api_key_masked}
              >
                <Input autoComplete={'off'} />
              </FormItem>
              <FormItem
                label={t('connector_api_secret')}
                name={'api_secret'}
                required={isCreate}
                description={t(isCreate ? 'connector_secret_note' : 'connector_keep_note')}
              >
                <Input type={'password'} autoComplete={'new-password'} />
              </FormItem>
              <FormItem
                label={t('connector_amount')}
                name={'max_amount_usdt'}
                description={t('connector_amount_note')}
              >
                <Input type={'number'} allowDecimal />
              </FormItem>
            </Form>
          </div>
        </Panel>
        <Panel title={t('connector_health')}>
          <div className={'px-3.5 py-2'}>
            <InfoRow
              label={t('positions_status')}
              value={t(`connector_status_${health.status}`)}
              valueClassName={
                health.status == 'connected'
                  ? '!text-success'
                  : health.status == 'failed'
                    ? '!text-error'
                    : undefined
              }
            />
            <InfoRow
              label={t('connector_balance')}
              value={health.balance === undefined ? '-' : `${formatAmount(health.balance)} USDT`}
            />
            <InfoRow
              label={t('connector_last_tested')}
              value={health.testedAt ? formatDatetime(health.testedAt, 'DD MMM, HH:mm') : '-'}
            />
            {!!health.message && (
              <p role={'status'} className={'paragraph-small !text-error py-1.5'}>
                {health.message}
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default ConnectorDetailPage
