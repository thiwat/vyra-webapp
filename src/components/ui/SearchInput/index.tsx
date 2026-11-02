import useSearch from '@/hooks/search'
import { t } from '@/utils/translate'
import Icon from '../Icon'
import { SearchInputProps } from './types'

/** Debounced (500ms) search box. */
const SearchInput = ({ initialValue, onSearch }: SearchInputProps) => {
  const { inputRef, onChange } = useSearch({
    initialValue,
    onSearch
  })

  return (
    <div
      className={
        'w-full md:w-[300px] shadow space-x-2 px-2 bg-card h-[34px] paragraph-base rounded flex flex-row items-center'
      }
    >
      <Icon name={'MagnifyingGlass'} size={18} className={'text-icon'} />
      <input
        ref={inputRef}
        className={'flex-1 outline-none paragraph-base bg-card min-w-0'}
        placeholder={t('common_search_placeholder')}
        onChange={onChange}
      />
    </div>
  )
}

export default SearchInput
