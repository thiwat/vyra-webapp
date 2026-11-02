import useSelect from '@/hooks/select'
import Select from '../Select'
import { AdvanceSelectProps } from './types'

/** Select whose options come from the generic entity list API. */
const AdvanceSelect = ({
  allowClear,
  baseFilters,
  disabled,
  entity,
  value,
  mode,
  plain,
  placeholder,
  valueFormat,
  labelFormat,
  onBlur,
  onChange
}: AdvanceSelectProps) => {
  const { options, loading } = useSelect({
    baseFilters,
    entity,
    valueFormat,
    labelFormat
  })

  return (
    <Select
      mode={mode}
      value={value}
      options={options}
      plain={plain}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
      allowClear={allowClear}
      onBlur={onBlur}
      onChange={onChange}
    />
  )
}

export default AdvanceSelect
