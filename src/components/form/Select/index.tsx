import _get from 'lodash/get'
import _isArray from 'lodash/isArray'
import { useMemo } from 'react'
import RCSelect, { components } from 'react-select'
import Icon from '@/components/ui/Icon'
import { t } from '@/utils/translate'
import Tag from './Tag'
import { SelectOptionProps, SelectProps } from './types'

/** react-select (unstyled) + Tailwind. Controlled `{ value, onChange }` with plain values. */
const Select = ({
  id,
  disabled,
  value,
  mode,
  options,
  plain,
  placeholder,
  allowClear = true,
  loading,
  autoCreateOption,
  customComponent,
  onBlur,
  onChange,
  onEndReached,
  onMenuClose,
  onMenuOpen,
  onValidateOption
}: SelectProps) => {
  const customComponents = useMemo(() => {
    const res: Record<string, any> = {
      Input: props => <components.Input {...props} autoComplete="new-password" />,
      GroupHeading: props => (
        <components.GroupHeading {...props}>
          <div className={'body-strong px-2 py-2'}>{props?.data?.label}</div>
        </components.GroupHeading>
      ),
      DropdownIndicator: props => (
        <components.DropdownIndicator {...props}>
          <Icon name={'CaretDown'} size={18} className={'text-icon cursor-pointer'} />
        </components.DropdownIndicator>
      ),
      ClearIndicator: props => (
        <components.ClearIndicator {...props}>
          <Icon
            name={'XCircle'}
            weight={'fill'}
            size={20}
            className={
              'group-hover/select:block hidden text-icon mr-1 cursor-pointer hover:text-error'
            }
          />
        </components.ClearIndicator>
      ),
      MultiValueRemove: props => (
        <components.MultiValueRemove {...props}>
          <Icon
            name={'XCircle'}
            weight={'fill'}
            size={16}
            className={'ml-1 mt-0.5 text-icon cursor-pointer hover:text-error'}
          />
        </components.MultiValueRemove>
      )
    }

    if (customComponent) {
      res.Option = props => (
        <components.Option {...props}>{customComponent(props.data)}</components.Option>
      )

      res.SingleValue = props => (
        <components.SingleValue {...props}>{customComponent(props.data)}</components.SingleValue>
      )
    }

    return res
  }, [customComponent])

  if (mode == 'tags') {
    return (
      <Tag
        value={value}
        disabled={disabled}
        allowClear={allowClear}
        placeholder={placeholder}
        customComponent={customComponent}
        onChange={onChange}
        onBlur={onBlur}
        onValidateOption={onValidateOption}
      />
    )
  }

  const currentValue = mode == 'multiple' && !_isArray(value) ? [] : value

  const allOptions: SelectOptionProps[] =
    autoCreateOption && value ? [{ label: value, value: value }] : options || []

  const _onChange = newValue => {
    if (!onChange) return

    if (mode == 'multiple') {
      return onChange((newValue || []).map(i => i.value))
    }
    onChange(newValue?.value)
    setTimeout(() => {
      onBlur && onBlur()
    }, 0)
  }

  const _findValue = () => {
    if (mode == 'multiple') {
      const flat = allOptions.flatMap(i => i.options || [i])
      return (currentValue || []).map(i => flat.find(j => j.value == i)).filter(i => !!i)
    }

    if (!_get(allOptions, '0.options')) return allOptions.find(i => currentValue == i.value) || null

    for (const group of allOptions) {
      const exists = (group.options || []).find(i => i.value == currentValue)
      if (exists) return exists
    }

    return null
  }

  const _onMenuClose = () => {
    onMenuClose && onMenuClose()
    onBlur && onBlur()
  }

  const borderClass = plain ? '' : 'border border-line'

  return (
    <div
      className={`group/select w-full min-h-[34px] flex items-center text-font text-sm rounded outline-none px-2 ${borderClass} group-[.field-error]:border-error ${disabled ? 'bg-disabled/20' : plain ? '' : 'bg-card'}`}
    >
      <RCSelect
        inputId={id}
        className={'w-full'}
        value={_findValue()}
        onChange={_onChange}
        isClearable={allowClear}
        isLoading={loading}
        options={allOptions as any}
        placeholder={placeholder ? placeholder : t('common_please_select')}
        noOptionsMessage={() => t('common_no_options')}
        isMulti={mode == 'multiple'}
        isDisabled={disabled}
        unstyled
        closeMenuOnSelect={mode != 'multiple'}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuShouldScrollIntoView={false}
        menuPosition={'absolute'}
        onMenuScrollToBottom={onEndReached}
        components={customComponents}
        styles={{ menuPortal: baseStyle => ({ ...baseStyle, zIndex: 999 }) }}
        menuPlacement={'auto'}
        onMenuOpen={onMenuOpen}
        onMenuClose={_onMenuClose}
        classNames={{
          menu: () => 'mt-1',
          menuList: () => 'bg-card rounded shadow border border-line no-scrollbar min-w-[75px]',
          option: state =>
            state.isSelected
              ? 'px-3 py-2 paragraph-base bg-primary/20 cursor-pointer'
              : state.isFocused
                ? 'px-3 py-2 paragraph-base bg-primary/10 cursor-pointer'
                : state.isDisabled
                  ? 'px-3 py-2 paragraph-base !text-disabled bg-disabled/20'
                  : 'px-3 py-2 paragraph-base cursor-pointer',
          placeholder: () => 'paragraph-base !text-disabled',
          dropdownIndicator: () => 'text-icon',
          clearIndicator: () => 'text-icon',
          valueContainer: () => 'px-0',
          input: () => 'px-0 paragraph-base',
          singleValue: () => 'paragraph-base',
          control: () => '!min-h-[32px]',
          multiValue: () => 'bg-plane mr-1.5 m-0.5 ml-0 px-1.5 py-0.5 rounded paragraph-base',
          noOptionsMessage: () => 'py-3 paragraph-base',
          loadingMessage: () => 'py-3 paragraph-base'
        }}
      />
    </div>
  )
}

export default Select
