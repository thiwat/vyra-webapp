import _isArray from 'lodash/isArray'
import { useMemo, useRef, useState } from 'react'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Icon from '@/components/ui/Icon'
import { SelectProps } from '../types'

/** Free-text tags (Enter/Tab/blur commits). Value: string[] */
const Tag = ({
  allowClear = true,
  disabled,
  placeholder,
  value,
  customComponent,
  onBlur,
  onChange,
  onValidateOption
}: SelectProps) => {
  const values: string[] = _isArray(value) ? value : []

  const [inputValue, setInputValue] = useState<string>('')
  const committedRef = useRef<string | null>(null)

  const commitInput = (rawValue = inputValue) => {
    const newValue = rawValue.trim()

    if (
      !newValue ||
      committedRef.current === newValue ||
      values.includes(newValue) ||
      (onValidateOption && !onValidateOption(newValue))
    ) {
      return
    }

    committedRef.current = newValue

    onChange?.([...values, newValue])
    setInputValue('')
  }

  const onKeyDown = event => {
    if (event.nativeEvent?.isComposing) return

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        commitInput()
        event.preventDefault()
    }
  }

  const onRemove = newValue => {
    onChange?.((newValue || []).map(i => i.value))
  }

  const onInputChange = newValue => {
    if (newValue !== inputValue) {
      committedRef.current = null
    }

    setInputValue(newValue)
  }

  const customComponents = useMemo(() => {
    const res: Record<string, any> = {
      DropdownIndicator: null,
      Input: props => <components.Input {...props} enterKeyHint="done" />,
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
      res.MultiValue = props => (
        <components.MultiValue {...props}>{customComponent(props.data)}</components.MultiValue>
      )
    }

    return res
  }, [customComponent])

  return (
    <CreatableSelect
      value={values.map(i => ({ label: i, value: i }))}
      isMulti
      unstyled
      isDisabled={disabled}
      isClearable={allowClear}
      menuIsOpen={false}
      placeholder={placeholder || ''}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onKeyDown={onKeyDown}
      onCreateOption={newValue => commitInput(newValue)}
      onBlur={() => {
        commitInput()
        onBlur && onBlur()
      }}
      onChange={onRemove}
      components={customComponents}
      classNames={{
        container: () =>
          `group/select w-full border border-line group-[.field-error]:border-error rounded !min-h-[34px] px-2 ${disabled ? 'bg-disabled/20' : 'bg-card'}`,
        control: () => 'w-full !min-h-[32px] text-font text-sm',
        input: () => 'paragraph-base',
        placeholder: () => 'paragraph-base !text-disabled',
        multiValue: () => 'bg-plane mr-1.5 m-0.5 ml-0 px-1.5 py-0.5 rounded paragraph-base',
        multiValueLabel: () => '!p-0'
      }}
    />
  )
}

export default Tag
