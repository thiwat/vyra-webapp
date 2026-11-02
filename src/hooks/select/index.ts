import { useRequest } from 'ahooks'
import _template from 'lodash/template'
import { useMemo } from 'react'
import { requestList } from '@/apis/client/entity'
import { SelectHookProps } from './types'

/** Options for AdvanceSelect from the generic entity list API (first 100 rows). */
const useSelect = ({
  baseFilters,
  labelFormat = '${ name }',
  valueFormat = '${ code }',
  entity
}: SelectHookProps) => {
  const listRequest = useRequest(requestList, {
    defaultParams: [
      {
        entity,
        page: 1,
        page_size: 100,
        filter: baseFilters
      }
    ]
  })

  const options = useMemo(() => {
    const label = _template(labelFormat)
    const value = _template(valueFormat)
    return (listRequest?.data?.rows || []).map(i => ({
      label: label(i),
      value: value(i)
    }))
  }, [listRequest?.data, labelFormat, valueFormat])

  return {
    options,
    loading: listRequest.loading
  }
}

export default useSelect
