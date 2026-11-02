import { useRequest } from 'ahooks'
import _isEmpty from 'lodash/isEmpty'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { requestList } from '@/apis/client/entity'
import { TablePageInfo } from '@/components/ui/Table/types'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/table'
import { decodeFilter, encodeFilter } from '@/utils/query'
import { ListServiceProps } from './types'

/**
 * List page controller over the generic entity API.
 * URL state: q=keywords, s=sort, f=filter, p=page, ps=page size.
 */
const useList = ({
  baseFilter,
  entity,
  defaultSort,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  keyData = 'code',
  manual
}: ListServiceProps) => {
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>([])

  const keyword = useRef<string>((router?.query?.q as string) || '')
  const sort = useRef<string>((router?.query?.s as string) || defaultSort || '')
  const filter = useRef<any>(decodeFilter(router?.query?.f as string) || {})
  const pageInfo = useRef<TablePageInfo>({
    current: +router?.query?.p || 1,
    pageSize: PAGE_SIZE_OPTIONS.includes(+router?.query?.ps) ? +router?.query?.ps : defaultPageSize,
    total: 0,
    totalPage: 1
  })

  const _getRequestParams = () => {
    const params = {
      entity,
      page: pageInfo.current.current,
      page_size: pageInfo.current.pageSize,
      keywords: keyword.current,
      sort: sort.current
    }

    const filters = []

    if (!_isEmpty(filter.current)) {
      filters.push(filter.current)
    }

    if (!_isEmpty(baseFilter)) {
      filters.push(baseFilter)
    }

    if (!_isEmpty(filters)) {
      params['filter'] = filters.length == 1 ? filters[0] : { $and: filters }
    }

    return params
  }

  const _updateQueryString = () => {
    const query = {
      ...router.query,
      q: keyword.current || undefined,
      s: sort.current || undefined,
      f: encodeFilter(filter.current) || undefined,
      p: pageInfo.current.current > 1 ? pageInfo.current.current : undefined,
      ps: pageInfo.current.pageSize != defaultPageSize ? pageInfo.current.pageSize : undefined
    }

    for (const key in query) {
      if (!query[key]) delete query[key]
    }

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
  }

  const listRequest = useRequest(requestList, {
    manual,
    defaultParams: [_getRequestParams()],
    onSuccess: r => {
      pageInfo.current = {
        current: r.page,
        pageSize: r.page_size,
        total: r.total,
        totalPage: r.total_page
      }
    }
  })

  const _clearSelect = () => {
    if (selected.length > 0) setSelected([])
  }

  const _reload = (resetPage = true) => {
    _clearSelect()
    if (resetPage) pageInfo.current = { ...pageInfo.current, current: 1 }
    _updateQueryString()
    listRequest.run(_getRequestParams())
  }

  const onSearch = (value: string) => {
    keyword.current = value
    _reload()
  }

  const onSort = (value: string) => {
    sort.current = value
    _reload()
  }

  const onFilter = (value: any) => {
    filter.current = value
    _reload()
  }

  const onChangePage = (page: number) => {
    pageInfo.current = { ...pageInfo.current, current: page }
    _reload(false)
  }

  const onChangePageSize = (size: number) => {
    if (size == pageInfo.current.pageSize) return
    pageInfo.current = { ...pageInfo.current, pageSize: size }
    _reload()
  }

  const onRefresh = () => {
    _clearSelect()
    listRequest.run(_getRequestParams())
  }

  const onSelect = (key: string, all?: boolean) => {
    if (!all) {
      return setSelected(prev =>
        prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
      )
    }

    const rows = listRequest?.data?.rows || []

    if (rows.length > 0 && rows.length == selected.length) {
      return setSelected([])
    }

    setSelected(rows.map(i => i[keyData]))
  }

  return {
    data: listRequest?.data?.rows || [],
    filter: filter.current || {},
    sort: sort.current,
    selected,
    loading: listRequest?.loading,
    keyword: keyword.current,
    pageInfo: pageInfo.current,
    onChangePage,
    onChangePageSize,
    onFilter,
    onSearch,
    onSelect,
    onSort,
    onRefresh
  }
}

export default useList
