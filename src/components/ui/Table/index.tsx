import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Checkbox from '@/components/form/Checkbox'
import { ColumnType } from '@/enums/table'
import { formatDatetime, formatNumber } from '@/utils/format'
import { t } from '@/utils/translate'
import Badge from '../Badge'
import Icon from '../Icon'
import PreviewImage from '../PreviewImage'
import { TableColumnProps, TableProps } from './types'

const FIXED_CLASS = {
  left: 'sticky left-0 bg-card shadow z-[5]',
  right: 'sticky right-0 bg-card shadow z-[5]'
}

const Table = ({
  allowBulk,
  columns: rawColumns,
  data,
  keyData = 'code',
  selected = [],
  sort,
  loading,
  rowFormat,
  rowCondition,
  onRowClick,
  onSort,
  onSelect
}: TableProps) => {
  const router = useRouter()

  const renderByType = (row: any, col: TableColumnProps, index: number) => {
    const value = _get(row, col.keyData)

    if (col.type == ColumnType.action) {
      const path = router.pathname
      return (
        <Link href={`${path}/${value}`}>
          <div className={'text-icon hover:text-primary cursor-pointer'}>
            <Icon name={'FileText'} size={20} />
          </div>
        </Link>
      )
    }

    if (col.type == ColumnType.boolean) {
      return <Badge type={'boolean'} value={value} />
    }

    if (col.type == ColumnType.badge) {
      return (
        <Badge
          color={_get(col, `colors.${value ?? col.defaultValue}`)}
          value={t(`${col.prefixTranslate || ''}${value ?? col.defaultValue}`)}
        />
      )
    }

    if (col.type == ColumnType.number) {
      return formatNumber(value)
    }

    if (col.type == ColumnType.datetime) {
      return formatDatetime(value)
    }

    if (col.type == ColumnType.date) {
      return formatDatetime(value, 'DD MMM YYYY')
    }

    if (col.type == ColumnType.image) {
      if (!value) return '-'
      return (
        <PreviewImage src={value}>
          <img src={value} alt={''} className={'h-[35px] w-[35px] rounded object-cover'} />
        </PreviewImage>
      )
    }

    if (col.type == ColumnType.bulk) {
      const key = _get(row, keyData)

      return <Checkbox value={selected.includes(key)} onChange={() => onSelect?.(key)} />
    }

    return col.renderer ? col.renderer(row, index) : (value ?? '-')
  }

  const _onSort = (col: TableColumnProps) => () => {
    if (!col.sorter || !onSort) return

    return sort == col.keyData
      ? onSort(`-${col.keyData}`)
      : sort == `-${col.keyData}`
        ? onSort('')
        : onSort(col.keyData)
  }

  if (_isEmpty(data)) {
    return (
      <div className={'flex justify-center items-center py-12 body-base'}>
        {loading ? (
          <Icon name={'CircleNotch'} size={24} className={'animate-spin text-icon'} />
        ) : (
          t('common_empty_data')
        )}
      </div>
    )
  }

  const columns = allowBulk
    ? [
        {
          keyData: 'bulk',
          type: ColumnType.bulk,
          width: 20,
          fixed: 'left'
        } as TableColumnProps,
        ...rawColumns
      ]
    : rawColumns

  return (
    <div className={`pt-3 w-full overflow-x-auto no-scrollbar ${loading ? 'opacity-60' : ''}`}>
      <table
        className={
          'table-auto min-w-full border-r border-l border-line border-separate border-spacing-0'
        }
      >
        <thead>
          <tr className={'group bg-card'}>
            {columns.map((i, index) => {
              const sortClass = i.sorter ? 'hover:bg-primary/10 cursor-pointer' : ''

              const paddingClass = i.type == ColumnType.bulk ? 'px-2 py-0' : 'pl-4 pr-2 py-0'

              return (
                <th
                  scope="col"
                  align={i.align || 'left'}
                  key={i.keyData || `col-${index}`}
                  className={`whitespace-nowrap tagline-medium ${paddingClass} border-line border-t border-b ${FIXED_CLASS[i.fixed] || ''} ${sortClass}`}
                  onClick={_onSort(i)}
                >
                  <div className={i.header ? '' : 'flex items-center relative w-full h-full'}>
                    <div className={'flex flex-row items-center'}>
                      {i.type == ColumnType.bulk ? (
                        <Checkbox
                          value={selected.length > 0 && selected.length == data.length}
                          onChange={() => onSelect?.(undefined, true)}
                        />
                      ) : i.header ? (
                        i.header()
                      ) : (
                        <div className={'my-1'}>{i.label}</div>
                      )}
                      {i.sorter && (
                        <div className={'ml-2'}>
                          <Icon
                            name={'CaretUp'}
                            weight={'fill'}
                            size={12}
                            className={`${sort == i.keyData ? 'text-primary' : 'text-icon'}`}
                          />
                          <Icon
                            name={'CaretDown'}
                            weight={'fill'}
                            size={12}
                            className={`-mt-1 ${sort == `-${i.keyData}` ? 'text-primary' : 'text-icon'}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((i, index) => {
            const rowStyle = rowFormat ? rowFormat(i, index) : {}

            const rowClass = rowCondition ? rowCondition(i) : ''

            return (
              <tr
                key={_get(i, keyData) ?? `row-${index}`}
                className={`bg-card ${onRowClick ? 'cursor-pointer hover:bg-plane' : ''}`}
                style={rowStyle}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
              >
                {columns.map(col => (
                  <td
                    key={col.keyData}
                    width={col.width}
                    className={`px-4 py-2 whitespace-nowrap tagline-base border-b border-line ${FIXED_CLASS[col.fixed] || ''} ${rowClass}`}
                    align={col.align || 'left'}
                  >
                    {renderByType(i, col, index)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
