import Link from 'next/link'
import { useRouter } from 'next/router'
import { useOverviewStateValue } from '@/atoms/overview'
import Panel, { EmptyState, InfoRow } from '@/components/business/trading/Panel'
import TradeTable from '@/components/business/trading/TradeTable'
import Form, { FormItem } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { DEFAULT_BOT } from '@/constants/exchange'
import useBotActions from '@/services/bot_actions'
import useBotDetail from '@/services/bot_detail'
import { formatDatetime } from '@/utils/format'
import { formatSigned, pnlClass } from '@/utils/trading'
import { t } from '@/utils/translate'

const BotDetailPage = () => {
  const router = useRouter()
  const { data: overview } = useOverviewStateValue()
  const detail = useBotDetail(router.query.key as string)
  const { form, isCreate, bot } = detail
  const { busy, onStart, onStop } = useBotActions({ onChanged: detail.refresh })
  const running = bot?.status == 'running'
  const flat = !bot?.active_trade

  return (
    <div className={'w-full max-w-[1100px] mx-auto'}>
      <Link
        href={'/bots'}
        className={'inline-flex flex-row items-center gap-1 paragraph-small hover:!text-font-dark'}
      >
        <Icon name={'ArrowLeft'} size={14} />
        {t('menu_bots')}
      </Link>
      <div className={'flex flex-row items-center gap-3 mt-3 mb-4'}>
        <h1 className={'flex-1 min-w-0 header-bold !text-font-dark truncate'}>
          {isCreate ? t('bot_create') : bot?.name}
        </h1>
        {!!bot && !running && flat && (
          <div>
            <Button type={'danger'} disabled={busy} onClick={detail.onDelete}>
              {t('bot_delete')}
            </Button>
          </div>
        )}
        {!!bot && (
          <div>
            {running ? (
              <Button disabled={busy} onClick={() => onStop(bot)}>
                {t('bot_stop')}
              </Button>
            ) : (
              <Button disabled={busy} onClick={() => onStart(bot)}>
                {t('bot_start')}
              </Button>
            )}
          </div>
        )}
        <div>
          <Button type={'primary'} disabled={detail.saving || running} onClick={detail.onSave}>
            {t('trading_save')}
          </Button>
        </div>
      </div>
      <div className={'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-3.5 items-start'}>
        <Panel title={t('bot_settings')}>
          <div className={'p-3.5'}>
            <Form
              form={form}
              name={'bot'}
              initialValues={DEFAULT_BOT}
              disabled={running}
              onFinish={detail.onSubmit}
            >
              <FormItem label={t('bot_name')} name={'name'} required>
                <Input />
              </FormItem>
              <div className={'grid grid-cols-2 gap-3'}>
                <FormItem label={t('bot_strategy')} name={'strategy'} required>
                  <Select
                    options={(overview?.bot_strategies || []).map(value => ({
                      label: t(`bot_strategy_${value}`),
                      value
                    }))}
                  />
                </FormItem>
                <FormItem label={t('positions_symbol')} name={'symbol'} required>
                  <Select
                    disabled={!flat}
                    options={detail.symbols.map(value => ({ label: value, value }))}
                  />
                </FormItem>
              </div>
              <FormItem
                label={t('bot_capital')}
                name={'capital_usdt'}
                required
                description={t('bot_capital_note')}
              >
                <Input type={'number'} allowDecimal />
              </FormItem>
              <div className={'grid grid-cols-2 gap-3'}>
                <FormItem
                  label={t('bot_risk')}
                  name={'risk_pct'}
                  required
                  description={t('bot_risk_note')}
                >
                  <Input type={'number'} allowDecimal />
                </FormItem>
                <FormItem
                  label={t('bot_max_daily_loss')}
                  name={'max_daily_loss_pct'}
                  required
                  description={t('bot_max_daily_loss_note')}
                >
                  <Input type={'number'} allowDecimal />
                </FormItem>
              </div>
              {running && <p className={'paragraph-small'}>{t('bot_running_note')}</p>}
            </Form>
          </div>
        </Panel>
        {!!bot && (
          <Panel title={t('bot_summary')}>
            <div className={'px-3.5 py-2'}>
              <InfoRow label={t('positions_status')} value={t(`bot_status_${bot.status}`)} />
              {!!bot.halt_reason && (
                <InfoRow
                  label={t('bot_halt_reason')}
                  value={bot.halt_reason}
                  valueClassName={'!text-error'}
                />
              )}
              <InfoRow
                label={t('bot_pnl_today')}
                value={formatSigned(bot.pnl_today)}
                valueClassName={pnlClass(bot.pnl_today)}
              />
              <InfoRow
                label={t('bot_pnl_total')}
                value={formatSigned(bot.pnl_total)}
                valueClassName={pnlClass(bot.pnl_total)}
              />
              <InfoRow label={t('bot_record')} value={`${bot.wins} / ${bot.losses}`} />
              <InfoRow
                label={t('bot_last_run')}
                value={bot.last_run_at ? formatDatetime(bot.last_run_at, 'DD MMM, HH:mm') : '-'}
              />
              {!!bot.last_message && (
                <p role={'status'} className={'paragraph-small py-1.5'}>
                  {bot.last_message}
                </p>
              )}
            </div>
          </Panel>
        )}
      </div>
      {!isCreate && (
        <div className={'mt-3.5'}>
          <Panel title={t('bot_trades')}>
            {detail.trades.length ? (
              <TradeTable rows={detail.trades} onNoteSaved={detail.refresh} />
            ) : (
              <EmptyState title={t('bot_no_trades')} detail={t('bot_no_trades_detail')} />
            )}
          </Panel>
        </div>
      )}
    </div>
  )
}

export default BotDetailPage
