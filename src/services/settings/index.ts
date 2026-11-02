import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { requestRules, requestSaveRules } from '@/apis/client/trading'
import { useForm } from '@/components/form/Form'
import { t } from '@/utils/translate'

const useSettings = () => {
  const [form] = useForm()

  const rulesRequest = useRequest(requestRules, {
    onSuccess: rules => form.setFieldsValue(rules.pending || rules.current)
  })

  const saveRequest = useRequest(requestSaveRules, {
    manual: true,
    onSuccess: rules => {
      rulesRequest.mutate(rules)
      toast.success(t('settings_saved'))
    }
  })

  const onSubmit = (values: Record<string, any>) => {
    const rules: any = { ...rulesRequest.data.current }
    Object.keys(values).forEach(key => {
      rules[key] = key == 'default_symbol' ? values[key] : +values[key]
    })
    saveRequest.run(rules)
  }

  return {
    form,
    pendingDay: rulesRequest.data?.pending_day,
    saving: saveRequest.loading,
    onSubmit
  }
}

export default useSettings
