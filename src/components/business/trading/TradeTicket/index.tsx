import { useEffect } from 'react'
import Display from '@/components/form/Display'
import Form, { FormItem } from '@/components/form/Form'
import Input from '@/components/form/Input'
import Segmented from '@/components/form/Segmented'
import Button from '@/components/ui/Button'
import { useOverviewStateValue } from '@/atoms/overview'
import useTradeTicket, { INITIAL_TICKET } from '@/services/trade_ticket'
import { riskRewardFor } from '@/utils/chart'
import { decimalsOf, formatAmount } from '@/utils/trading'
import { t } from '@/utils/translate'
import Panel, { InfoRow } from '../Panel'
import PriceChart from '../PriceChart'
import { ChartLevel } from '../PriceChart/types'
import TradeReview from '../TradeReview'

const FALLBACK_RULES = { tick_size: 0.01, step_size: 0.001 }
const LONG_ACTIVE = 'bg-success/15 !text-success'
const SHORT_ACTIVE = 'bg-error/15 !text-error'

const Check = ({ ok, warn, children }: { ok: boolean; warn?: boolean; children: string }) => (
  <div
    className={`flex flex-row gap-2 paragraph-small ${warn ? '!text-warning' : ok ? '' : '!text-font-dark'}`}
  >
    <span className={`num ${warn ? '!text-warning' : ok ? '!text-success' : '!text-error'}`}>
      {warn ? '!' : ok ? '✓' : '×'}
    </span>
    <span>{children}</span>
  </div>
)

const TradeTicket = () => {
  const ticket = useTradeTicket()
  const { form, values, plan, markPrice, review } = ticket
  const { data: overview } = useOverviewStateValue()
  const symbol = overview?.symbols?.find(s => s.symbol == values.symbol) || (FALLBACK_RULES as any)
  const price = decimalsOf(symbol.tick_size)
  const quantity = decimalsOf(symbol.step_size)
  const isLong = values.side == 'long'
  const isMarket = values.entry_type == 'market'

  const defaultLeverage = overview?.rules?.default_leverage

  const enabledSymbol = overview?.rules?.default_symbol

  useEffect(() => {
    if (defaultLeverage) form.setFieldsValue({ leverage: defaultLeverage })
  }, [defaultLeverage])

  useEffect(() => {
    if (enabledSymbol) form.setFieldsValue({ symbol: enabledSymbol })
  }, [enabledSymbol])

  useEffect(() => {
    if (isMarket && markPrice) form.setFieldsValue({ entry_price: markPrice })
  }, [isMarket, markPrice])

  const onLevelChange = (level: ChartLevel, price: number) => {
    if (level == 'entry') return form.setFieldsValue({ entry_price: price })
    if (level == 'sl') return form.setFieldsValue({ stop_mode: 'price', stop_value: price })
    const reward = riskRewardFor(values.side, plan.entry_price, plan.stop_loss_price, price)
    if (reward) form.setFieldsValue({ risk_reward: reward })
  }

  const summary = plan
    ? [
        [t('ticket_tp'), formatAmount(plan.take_profit_price, price)],
        [
          t('ticket_size'),
          `${formatAmount(plan.quantity, quantity)} · ${formatAmount(plan.notional)} USDT`
        ],
        [t('ticket_margin'), `${formatAmount(plan.margin)} USDT`],
        [t('ticket_fees'), `${formatAmount(plan.estimated_fees)} USDT`],
        [t('ticket_liquidation'), formatAmount(plan.estimated_liquidation_price, price)]
      ]
    : []

  return (
    <div className={'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-3.5 flex-1 min-h-0'}>
      <PriceChart
        symbol={values.symbol}
        price={markPrice}
        tickSize={symbol.tick_size}
        plan={plan}
        entryEditable={!isMarket}
        onLevelChange={onLevelChange}
      />
      <Panel className={'overflow-auto'}>
        <div className={'p-3.5'}>
          <Form form={form} name={'trade-ticket'} initialValues={INITIAL_TICKET}>
            <FormItem label={t('ticket_symbol')} name={'symbol'}>
              <Display />
            </FormItem>
            <div className={'grid grid-cols-2 gap-2'}>
              <FormItem name={'side'}>
                <Segmented
                  options={[
                    { label: t('ticket_long'), value: 'long', activeClassName: LONG_ACTIVE },
                    { label: t('ticket_short'), value: 'short', activeClassName: SHORT_ACTIVE }
                  ]}
                />
              </FormItem>
              <FormItem name={'entry_type'}>
                <Segmented
                  options={[
                    { label: t('ticket_market'), value: 'market' },
                    { label: t('ticket_limit'), value: 'limit' }
                  ]}
                />
              </FormItem>
            </div>
            <FormItem label={t('ticket_entry')} name={'entry_price'}>
              <Input type={'number'} allowDecimal disabled={isMarket} />
            </FormItem>
            <div className={'grid grid-cols-[minmax(0,1fr)_96px] gap-2 items-end'}>
              <FormItem label={t('ticket_stop')} name={'stop_value'}>
                <Input type={'number'} allowDecimal />
              </FormItem>
              <FormItem name={'stop_mode'}>
                <Segmented
                  options={[
                    { label: t('ticket_stop_pct'), value: 'pct' },
                    { label: t('ticket_stop_price'), value: 'price' }
                  ]}
                  onChange={() => form.setFieldsValue({ stop_value: '' })}
                />
              </FormItem>
            </div>
            <div className={'grid grid-cols-2 gap-2'}>
              <FormItem label={t('ticket_rr')} name={'risk_reward'}>
                <Input type={'number'} allowDecimal />
              </FormItem>
              <FormItem label={t('ticket_leverage')} name={'leverage'}>
                <Input type={'number'} min={1} max={5} />
              </FormItem>
            </div>
          </Form>

          {!!plan && (
            <>
              <div className={'border-t border-line mt-1 pt-1'}>
                {summary.map(([label, value]) => (
                  <InfoRow key={label} label={label} value={value} />
                ))}
                <InfoRow
                  label={t('ticket_loss')}
                  value={`−${formatAmount(plan.estimated_loss)} USDT`}
                  valueClassName={'!text-error'}
                />
                <InfoRow
                  label={t('ticket_profit')}
                  value={`+${formatAmount(plan.estimated_profit)} USDT`}
                  valueClassName={'!text-success'}
                />
              </div>
              <div className={'space-y-1 my-2.5'}>
                {plan.errors.map(error => (
                  <Check key={error.code} ok={false}>
                    {error.message}
                  </Check>
                ))}
                {plan.ok && (
                  <Check ok={true}>
                    {t('ticket_budget', {
                      loss: formatAmount(plan.estimated_loss),
                      budget: formatAmount(plan.risk_budget)
                    })}
                  </Check>
                )}
                {plan.capped_by_max_notional && (
                  <Check ok={true} warn>
                    {t('ticket_capped', { max: overview?.rules?.max_notional_usdt })}
                  </Check>
                )}
              </div>
            </>
          )}

          <Button type={isLong ? 'long' : 'short'} disabled={!plan?.ok} onClick={ticket.onPreview}>
            {t(isLong ? 'ticket_buy' : 'ticket_sell')}
          </Button>
        </div>
      </Panel>
      <TradeReview
        open={!!review}
        plan={review?.plan}
        side={review?.input?.side}
        symbol={review?.input?.symbol}
        entryType={review?.input?.entry_type}
        leverage={review?.input?.leverage}
        tickSize={symbol.tick_size}
        stepSize={symbol.step_size}
        result={ticket.result}
        placing={ticket.placing}
        isLive={overview?.mode == 'live'}
        onConfirm={ticket.onConfirm}
        onClose={ticket.onCloseReview}
        onViewPosition={ticket.onViewPosition}
      />
    </div>
  )
}

export default TradeTicket
