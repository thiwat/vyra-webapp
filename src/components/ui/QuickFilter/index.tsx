import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { t } from '@/utils/translate'
import { QuickFilterProps } from './types'

const ACTIVE_CLASS = 'bg-primary/75 !text-white'

/** Chip row that sets `{ [field]: value }` as the list filter (pairs with useList().onFilter). */
const QuickFilter = ({ value, options, onChange }: QuickFilterProps) => {
  const onClick = (key: string, field?: string) => () => {
    onChange?.({ [field]: key })
  }

  if (_isEmpty(options)) return null

  return (
    <div className={'flex flex-row space-x-3 mb-3 overflow-x-auto no-scrollbar'}>
      <div
        onClick={() => onChange?.({})}
        className={`flex flex-row items-center cursor-pointer px-3 paragraph-base shadow rounded h-[30px] ${_isEmpty(value) ? ACTIVE_CLASS : 'bg-card'}`}
      >
        {t('common_all')}
      </div>
      {options.map(i => (
        <div
          key={`${i.field}-${i.value}`}
          onClick={onClick(i.value, i.field)}
          className={`flex flex-row items-center whitespace-nowrap cursor-pointer px-3 paragraph-base shadow rounded h-[30px] ${_get(value, i.field) == i.value ? ACTIVE_CLASS : 'bg-card'}`}
        >
          {i.label}
        </div>
      ))}
    </div>
  )
}

export default QuickFilter
