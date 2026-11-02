import ReactPaginate from 'react-paginate'
import Icon from '../Icon'
import { PaginateProps } from './types'

const LINK_CLASS =
  'flex items-center justify-center h-[30px] min-w-[30px] px-1 border border-line rounded bg-card body-base cursor-pointer'

const Paginate = ({ page, total = 0, onChange }: PaginateProps) => {
  if (total <= 0) return null

  return (
    <div className={'flex flex-row items-center'}>
      <ReactPaginate
        forcePage={page ? page - 1 : 0}
        pageCount={total}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={({ selected }) => onChange(selected + 1)}
        containerClassName={'flex flex-row flex-wrap gap-1.5'}
        previousLabel={<Icon name={'CaretLeft'} size={16} className={'text-font'} />}
        nextLabel={<Icon name={'CaretRight'} size={16} className={'text-font'} />}
        breakLinkClassName={LINK_CLASS}
        pageLinkClassName={LINK_CLASS}
        previousLinkClassName={LINK_CLASS}
        nextLinkClassName={LINK_CLASS}
        activeLinkClassName={'!bg-primary !text-white'}
      />
    </div>
  )
}

export default Paginate
