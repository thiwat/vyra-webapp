import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { requestCreate, requestDelete, requestGet, requestUpdate } from '@/apis/client/entity'
import { requestTestConnection } from '@/apis/client/trading'
import { Connector } from '@/apis/client/trading/types'
import { useForm, useWatch } from '@/components/form/Form'
import Modal from '@/components/ui/Modal'
import { BASE_URLS } from '@/constants/exchange'
import { Entity } from '@/enums/entity'
import { t } from '@/utils/translate'

const LIST_PATH = '/connectors'

const useConnectorDetail = (key?: string) => {
  const router = useRouter()
  const [form] = useForm()
  const isCreate = key == 'create'

  const detailRequest = useRequest<Connector, []>(
    () => requestGet({ entity: Entity.connector, key }),
    {
      ready: !!key && !isCreate,
      refreshDeps: [key],
      onSuccess: connector => form.setFieldsValue({ ...connector, api_key: '', api_secret: '' })
    }
  )

  // Full reload so the header picks up a first or edited connector.
  const onSaved = () => window.location.assign(LIST_PATH)

  const createRequest = useRequest(requestCreate, { manual: true, onSuccess: onSaved })
  const updateRequest = useRequest(requestUpdate, { manual: true, onSuccess: onSaved })
  const environment = useWatch('environment', form)
  const testRequest = useRequest(requestTestConnection, {
    manual: true,
    onSuccess: () => {
      if (!isCreate) detailRequest.refresh()
    }
  })
  const deleteRequest = useRequest(requestDelete, {
    manual: true,
    onSuccess: () => {
      toast.success(t('connector_deleted'))
      router.push(LIST_PATH)
    }
  })

  const onSubmit = (values: Record<string, any>) => {
    const amount = +values.max_amount_usdt || null
    if (isCreate) {
      return createRequest.run({
        entity: Entity.connector,
        data: { ...values, max_amount_usdt: amount || undefined }
      })
    }
    updateRequest.run({
      entity: Entity.connector,
      key,
      data: {
        name: values.name,
        api_key: values.api_key || undefined,
        api_secret: values.api_secret || undefined,
        max_amount_usdt: amount
      }
    })
  }

  const onTest = () => {
    const { environment, api_key, api_secret } = form.getFieldsValue()
    testRequest.run({ id: isCreate ? undefined : key, environment, api_key, api_secret })
  }

  const onDelete = () =>
    Modal.confirm({
      title: t('connector_delete_title', { name: detailRequest.data?.name }),
      description: t('connector_delete_detail'),
      confirmLabel: t('connector_delete'),
      cancelLabel: t('review_cancel'),
      onConfirm: () => deleteRequest.run({ entity: Entity.connector, key })
    })

  const connector = detailRequest.data
  const result = testRequest.data
  const ok = result ? result.ok : connector?.last_test_ok
  const tested = !!result || !!connector?.last_tested_at
  const health = {
    status: !tested ? 'untested' : ok ? 'connected' : 'failed',
    balance: result ? result.balance : connector?.last_test_balance,
    message: result ? result.message : connector?.last_test_message,
    testedAt: connector?.last_tested_at
  } as const

  return {
    form,
    baseUrl: BASE_URLS[connector?.environment || environment || 'demo'],
    health,
    onSave: () => form.submit(),
    isCreate,
    connector,
    saving: createRequest.loading || updateRequest.loading,
    testing: testRequest.loading,
    onSubmit,
    onTest,
    onDelete
  }
}

export default useConnectorDetail
