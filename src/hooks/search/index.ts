import _debounce from 'lodash/debounce'
import { useEffect, useMemo, useRef } from 'react'
import { SearchHookProps } from './types'

const useSearch = ({ initialValue, onSearch }: SearchHookProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const onSearchRef = useRef(onSearch)
  onSearchRef.current = onSearch

  const delaySearch = useMemo(
    () => _debounce((value: string) => onSearchRef.current?.(value), 500),
    []
  )

  useEffect(() => () => delaySearch.cancel(), [delaySearch])

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = initialValue || ''
  }, [initialValue])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    delaySearch(e.target.value)
  }

  return {
    inputRef,
    onChange
  }
}

export default useSearch
