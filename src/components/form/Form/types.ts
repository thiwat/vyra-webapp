import type { FormProps as RCFormProps } from 'rc-field-form'
import type { FieldProps } from 'rc-field-form/es/Field'
import type { FormInstance as RCFormInstance } from 'rc-field-form/es/interface'

export type FormInstance<T = any> = RCFormInstance<T> & {
  /** Show server-side errors on fields: form.setErrors({ username: 'Duplicate' }) */
  setErrors?: (errors: Record<string, string>) => void
}

export type FormProps = RCFormProps & {
  form?: FormInstance
  /** Disable every FormItem child control */
  disabled?: boolean
  /** Scroll the first invalid field into view on submit (default true) */
  scrollToError?: boolean
}

export type FormItemProps = FieldProps & {
  label?: React.ReactNode
  blink?: boolean
  className?: string
  required?: boolean
  /** Helper text shown under the control when there is no error */
  description?: React.ReactNode
  /** Hide the label/error rows (bare field) */
  noStyle?: boolean
}
