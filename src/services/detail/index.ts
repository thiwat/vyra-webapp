import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { requestCreate, requestGet, requestUpdate } from '@/apis/client/entity'
import { useForm } from '@/components/form/Form'
import { DetailMode } from '@/enums/detail'
import { t } from '@/utils/translate'
import { DetailServiceProps } from './types'

/**
 * Create/update page controller over the generic entity API.
 * Errors are toasted by the global request handler; use `onError` for field errors.
 */
const useDetail = ({
  entity,
  key,
  initialValues,
  prepareData,
  prepareBeforeSave,
  onSuccess,
  onError
}: DetailServiceProps) => {
  const router = useRouter()

  const [form] = useForm()

  const mode = key == 'create' ? DetailMode.create : DetailMode.update

  const backToList = () => {
    const pathname = router.pathname.replace('/[key]', '')
    router.replace(pathname)
  }

  const _onSuccess = async (r: any, message: string) => {
    toast.success(message)
    if (onSuccess) return onSuccess(r)
    backToList()
  }

  const getRequest = useRequest(requestGet, {
    manual: true,
    onSuccess: r => {
      form.setFieldsValue(prepareData ? prepareData(r) : r)
    }
  })

  const createRequest = useRequest(requestCreate, {
    manual: true,
    onSuccess: r => _onSuccess(r, t('common_create_success')),
    onError
  })

  const updateRequest = useRequest(requestUpdate, {
    manual: true,
    onSuccess: r => _onSuccess(r, t('common_update_success')),
    onError
  })

  useEffect(() => {
    if (!key) return
    if (mode == DetailMode.update) {
      getRequest.run({ entity, key })
    } else if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [key])

  const onRefresh = () => {
    getRequest.run({ entity, key })
  }

  const onSubmit = (values: any) => {
    const data = prepareBeforeSave ? prepareBeforeSave(values) : values

    if (mode == DetailMode.create) {
      return createRequest.run({ entity, data })
    }

    updateRequest.run({ entity, key, data })
  }

  return {
    data: getRequest?.data || {},
    form,
    loading: getRequest.loading,
    submitting: createRequest.loading || updateRequest.loading,
    mode,
    onSubmit,
    onRefresh
  }
}

export default useDetail
