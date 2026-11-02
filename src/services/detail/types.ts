import { Entity } from '@/enums/entity'
import { RequestError } from '@/apis/client/request'

export type DetailServiceProps = {
  entity: Entity | string
  /** route `[key]`; the literal 'create' means create mode */
  key: string
  /** create mode: initial form values */
  initialValues?: any
  /** API -> form values */
  prepareData?: (values: any) => any
  /** form values -> API payload */
  prepareBeforeSave?: (values: any) => any
  /** after create/update succeeded (default: go back to the list page) */
  onSuccess?: (res?: any) => void | Promise<void>
  /** extra error handling, e.g. map `error.code` to a field with form.setErrors */
  onError?: (error: RequestError) => void
}
