import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { decimalsOf, formatAmount, sideClass } from '@/utils/trading'
import { t } from '@/utils/translate'
import { InfoRow } from '../Panel'
import { TradeReviewProps } from './types'

const Check = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className={`paragraph-small ${ok ? '!text-font-dark' : '!text-error'}`}>
    <span className={ok ? '!text-success' : '!text-error'}>{ok ? '✓ ' : '× '}</span>
    {label}
  </div>
)

const TradeReview = ({
  open,
  plan,
  side,
  symbol,
  entryType,
  leverage,
  tickSize,
  stepSize,
  result,
  placing,
  isLive,
  onConfirm,
  onClose,
  onViewPosition
}: TradeReviewProps) => {
  if (!plan) return null
  const price = decimalsOf(tickSize)
  const quantity = decimalsOf(stepSize)
  const isLong = side == 'long'

  const renderResult = () => (
    <>
      <div className={'px-4 py-3 space-y-1.5'}>
        <InfoRow label={t('review_entry_status')} value={t(`trade_status_${result.status}`)} />
        <InfoRow
          label={t('review_filled')}
          value={formatAmount(result.filled_quantity, quantity)}
        />
        {['pending_entry', 'entry_unknown'].includes(result.status) ? (
          <p className={'paragraph-small'}>
            {t(
              result.status == 'pending_entry' ? 'review_pending' : 'trading_alert_unknown_detail'
            )}
          </p>
        ) : (
          <>
            <Check ok={result.stop_loss_confirmed} label={t('positions_stop')} />
            <Check ok={result.take_profit_confirmed} label={t('positions_take')} />
          </>
        )}
      </div>
      <div className={'flex flex-row justify-end px-4 py-3 border-t border-line'}>
        <div>
          <Button type={'primary'} onClick={onViewPosition}>
            {t('review_view_position')}
          </Button>
        </div>
      </div>
    </>
  )

  const renderReview = () => (
    <>
      <div className={'px-4 py-3'}>
        <InfoRow
          label={t('review_order')}
          value={`${entryType?.toUpperCase()} · ${formatAmount(plan.entry_price, price)}`}
        />
        <InfoRow
          label={t('review_size')}
          value={`${formatAmount(plan.quantity, quantity)} (${formatAmount(plan.notional)} USDT)`}
        />
        <InfoRow
          label={t('review_margin')}
          value={`${formatAmount(plan.margin)} USDT · ${leverage}x Isolated`}
        />
        <InfoRow
          label={t('ticket_stop')}
          value={`${formatAmount(plan.stop_loss_price, price)} (−${formatAmount(plan.estimated_loss)} USDT)`}
        />
        <InfoRow
          label={t('ticket_tp')}
          value={`${formatAmount(plan.take_profit_price, price)} (+${formatAmount(plan.estimated_profit)} USDT)`}
        />
        <InfoRow label={t('ticket_fees')} value={`${formatAmount(plan.estimated_fees)} USDT`} />
        <p className={'paragraph-small mt-2.5'}>{t('review_warning')}</p>
        {isLive && (
          <p role={'alert'} className={'body-strong !text-error mt-2'}>
            {t('review_live_warning')}
          </p>
        )}
      </div>
      <div className={'flex flex-row justify-end gap-2 px-4 py-3 border-t border-line'}>
        <div>
          <Button onClick={onClose}>{t('review_cancel')}</Button>
        </div>
        <div>
          <Button type={isLong ? 'long' : 'short'} disabled={placing} onClick={onConfirm}>
            {t(isLive ? 'review_confirm_live' : 'review_confirm')}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <Modal open={open} modalClassName={'w-[440px]'} onClose={result ? undefined : onClose}>
      <h3 className={'px-4 py-3 body-strong !text-font-dark border-b border-line'}>
        {result ? (
          t('review_result_title')
        ) : (
          <>
            {'Review '}
            <span className={sideClass(side)}>{side?.toUpperCase()}</span>
            {` ${symbol}`}
          </>
        )}
      </h3>
      {result ? renderResult() : renderReview()}
    </Modal>
  )
}

export default TradeReview
