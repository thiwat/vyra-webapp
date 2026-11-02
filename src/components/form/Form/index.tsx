import _get from 'lodash/get'
import _isArray from 'lodash/isArray'
import _isUndefined from 'lodash/isUndefined'
import RCForm, { Field } from 'rc-field-form'
import type { FieldData } from 'rc-field-form/es/interface'
import React, { useContext, useMemo, useState } from 'react'
import { t } from '@/utils/translate'
import { FormInstance, FormItemProps, FormProps } from './types'

export const FormContext = React.createContext<{
  errors: Record<string, string>
  form: FormInstance | null
  disabled?: boolean
}>({ errors: {}, form: null, disabled: false })

export const FormListContext = React.createContext<{
  listName?: string | number | (string | number)[]
}>({
  listName: undefined
})

const toKey = (name: any): string => (Array.isArray(name) ? name.join('__') : `${name}`)

/**
 * Field wrapper: label + control + error/description row.
 * The child must be a controlled `{ value, onChange }` component.
 */
export const FormItem = ({
  children,
  blink,
  label,
  className,
  required,
  noStyle,
  validateTrigger,
  description,
  ...props
}: FormItemProps) => {
  const { errors, disabled } = useContext(FormContext)
  const { listName } = useContext(FormListContext)

  const rawName = props.name as string | string[]
  const name = listName ? `${toKey(listName)}__${toKey(rawName)}` : toKey(rawName)

  const error = _get(errors, name)
  const rules = [...(props.rules || [])]

  if (required) {
    rules.push({
      required: true,
      message: t('common_info_required_field')
    })
  }

  const childProps = {
    id: name,
    'data-testid': name
  }

  if (disabled) childProps['disabled'] = true

  const Child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, childProps as any)
    : children

  return (
    <div
      id={`field-${name}`}
      className={`group ${!_isUndefined(error) ? 'field-error' : ''} ${blink ? 'animate-[pulse_0.25s_ease-in-out_infinite]' : ''} ${className || ''}`}
    >
      {!!label && (
        <p className={'line-clamp-1 group-[.field-error]:!text-error header-field-title mb-1'}>
          {label}
          {required && <span className={'text-error ml-1'}>*</span>}
        </p>
      )}
      <Field {...props} rules={rules} validateTrigger={validateTrigger}>
        {Child as any}
      </Field>
      {!noStyle && (
        <div className={'min-h-4 mt-0.5'}>
          {error ? (
            <div className="tagline-base !text-error">{error}</div>
          ) : (
            <div className="tagline-base truncate">{description}</div>
          )}
        </div>
      )}
    </div>
  )
}

/** rc-field-form wrapper with an error context, `form.setErrors` and `disabled`. */
const Form = ({
  children,
  disabled,
  form,
  scrollToError = true,
  onFieldsChange,
  onFinishFailed,
  ...props
}: FormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const contextValue = useMemo(() => ({ errors, form, disabled }), [errors, form, disabled])

  if (form) {
    form.setErrors = (error: Record<string, string>) => setErrors(error || {})
  }

  const handleOnFinishFailed = data => {
    const { errorFields } = data
    const res = {}
    for (const error of errorFields) {
      const [err] = error.errors
      res[toKey(error.name)] = err
    }
    setErrors(res)
    if (onFinishFailed) onFinishFailed(data)

    if (scrollToError) {
      setTimeout(() => {
        const elements = document.getElementsByClassName('field-error')
        if (elements.length > 0) {
          elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 10)
    }
  }

  const handleOnFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {
    const res = {}
    for (const error of allFields.filter(i => i.errors.length)) {
      const key: string[] = _isArray(error.name) ? (error.name as string[]) : [error.name as string]
      const [err] = error.errors
      res[toKey(key)] = err
    }
    setErrors(res)
    if (onFieldsChange) onFieldsChange(changedFields, allFields)
  }

  return (
    <FormContext.Provider value={contextValue}>
      <RCForm
        {...props}
        form={form}
        validateTrigger={'onBlur'}
        onFinishFailed={handleOnFinishFailed}
        onFieldsChange={handleOnFieldsChange}
      >
        {children}
      </RCForm>
    </FormContext.Provider>
  )
}

export const FormList = RCForm.List

export const useWatch = RCForm.useWatch

export const useForm = <T = any,>(): [FormInstance<T>] => {
  const [form] = RCForm.useForm<T>()
  return [form as FormInstance<T>]
}

export default Form
