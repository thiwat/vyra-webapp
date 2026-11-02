import Link from 'next/link'
import { useRouter } from 'next/router'
import { t } from '@/utils/translate'
import Button from '../Button'
import RefreshButton from '../RefreshButton'
import SearchInput from '../SearchInput'
import { ListHeaderProps } from './types'

/** Search + refresh + "create" (links to `<current path>/create` unless `onCreate` is given). */
const ListHeader = ({ keyword, hideCreate, onCreate, onRefresh, onSearch }: ListHeaderProps) => {
  const { pathname } = useRouter()

  return (
    <div
      className={
        'flex flex-col md:flex-row justify-between items-stretch md:items-center py-3 gap-3'
      }
    >
      <div className={'flex flex-row space-x-3'}>
        <SearchInput initialValue={keyword} onSearch={onSearch} />
        {!!onRefresh && <RefreshButton onRefresh={onRefresh} />}
      </div>
      {!hideCreate && (
        <div>
          {onCreate ? (
            <Button type={'primary'} icon={'Plus'} onClick={onCreate}>
              {t('common_button_create')}
            </Button>
          ) : (
            <Link href={`${pathname}/create`}>
              <Button type={'primary'} icon={'Plus'}>
                {t('common_button_create')}
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ListHeader
