import { useRequest } from 'ahooks'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { requestUpdate } from '@/apis/client/entity'
import { Trade } from '@/apis/client/trading/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import { Entity } from '@/enums/entity'
import { formatDatetime } from '@/utils/format'
import { formatAmount, formatSigned, pnlClass, sideClass } from '@/utils/trading'
import { t } from '@/utils/translate'
import { TradeTableProps } from './types'

const number = (value?: number) => (value ? formatAmount(value) : '-')

const TradeTable = ({ rows, sort, onSort, onNoteSaved }: TradeTableProps) => {
  const [editing, setEditing] = useState<Trade | null>(null)
  const [note, setNote] = useState('')

  const saveRequest = useRequest(requestUpdate, {
    manual: true,
    onSuccess: () => {
      toast.success(t('journal_note_saved'))
      setEditing(null)
      onNoteSaved?.()
    }
  })

  const onEdit = (trade: Trade) => {
    setNote(trade.note || '')
    setEditing(trade)
  }

  return (
    <>
      <Table
        data={rows}
        sort={sort}
        onSort={onSort}
        columns={[
          {
            label: t('journal_closed'),
            keyData: 'closed_at',
            sorter: !!onSort,
            renderer: row => (row.closed_at ? formatDatetime(row.closed_at, 'DD MMM, HH:mm') : '-')
          },
          { label: t('positions_symbol'), keyData: 'symbol' },
          {
            label: t('positions_side'),
            keyData: 'side',
            renderer: row => <span className={sideClass(row.side)}>{row.side.toUpperCase()}</span>
          },
          {
            label: t('positions_entry'),
            keyData: 'average_entry_price',
            align: 'right',
            renderer: row => <span className={'num'}>{number(row.average_entry_price)}</span>
          },
          {
            label: t('journal_exit'),
            keyData: 'exit_price',
            align: 'right',
            renderer: row => <span className={'num'}>{number(row.exit_price)}</span>
          },
          {
            label: t('journal_fees'),
            keyData: 'fees',
            align: 'right',
            renderer: row => <span className={'num'}>{number(row.fees)}</span>
          },
          {
            label: t('journal_net'),
            keyData: 'realized_pnl',
            align: 'right',
            renderer: row => (
              <span className={`num ${pnlClass(row.realized_pnl)}`}>
                {row.realized_pnl === undefined ? '-' : formatSigned(row.realized_pnl)}
              </span>
            )
          },
          {
            label: t('journal_closed_by'),
            keyData: 'close_reason',
            renderer: row =>
              row.close_reason
                ? t(`trade_reason_${row.close_reason}`)
                : t(`trade_status_${row.status}`)
          },
          {
            label: t('journal_notes'),
            keyData: 'note',
            renderer: row => (
              <Button link onClick={() => onEdit(row)}>
                {row.note || t('journal_add_note')}
              </Button>
            )
          }
        ]}
      />
      <Modal open={!!editing} modalClassName={'w-[440px]'} onClose={() => setEditing(null)}>
        <h3 className={'px-4 py-3 body-strong !text-font-dark border-b border-line'}>
          {t('journal_note_title')}
        </h3>
        <div className={'p-4'}>
          <textarea
            aria-label={t('journal_note_title')}
            value={note}
            maxLength={2000}
            rows={5}
            onChange={e => setNote(e.target.value)}
            className={
              'w-full bg-plane rounded outline-none p-2 border border-line focus:border-primary paragraph-base'
            }
          />
          <div className={'mt-3'}>
            <Button
              type={'primary'}
              disabled={saveRequest.loading}
              onClick={() =>
                saveRequest.run({ entity: Entity.trade, key: editing.id, data: { note } })
              }
            >
              {t('common_button_save')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TradeTable
