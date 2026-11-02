import Select from '@/components/form/Select'
import { PAGE_SIZE_OPTIONS } from '@/constants/table'
import { t } from '@/utils/translate'
import Paginate from './Paginate'
import { TableFooterProps } from './types'

const TableFooter = ({ pageInfo, onChangePage, onChangePageSize }: TableFooterProps) => {
  return (
    <div className={'flex flex-col-reverse md:flex-row gap-3 justify-between md:items-center pb-3'}>
      <Paginate page={pageInfo?.current} total={pageInfo?.totalPage} onChange={onChangePage} />
      <div className={'flex flex-row space-x-2 items-center'}>
        <div className={'tagline-base whitespace-nowrap'}>
          {t('common_table_total_records', { count: pageInfo?.total ?? 0 })}
        </div>
        <div className={'h-6 w-px bg-line'} />
        <div className={'flex flex-row items-center space-x-2'}>
          <div className={'w-[80px]'}>
            <Select
              allowClear={false}
              value={pageInfo?.pageSize}
              options={PAGE_SIZE_OPTIONS.map(i => ({ label: `${i}`, value: i }))}
              onChange={onChangePageSize}
            />
          </div>
          <span className={'whitespace-nowrap tagline-base'}>{t('common_table_page_size')}</span>
        </div>
      </div>
    </div>
  )
}

export default TableFooter
