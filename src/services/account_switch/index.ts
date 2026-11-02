import { useRequest } from 'ahooks'
import { requestActivateConnector } from '@/apis/client/trading'
import Modal from '@/components/ui/Modal'
import { t } from '@/utils/translate'

type SwitchTarget = { id: string; name: string; environment: string }

/** Selecting an account reloads the app, so every page reads that account's data. */
const useAccountSwitch = () => {
  const switchRequest = useRequest(requestActivateConnector, {
    manual: true,
    onSuccess: () => window.location.reload()
  })

  const onSwitch = (account: SwitchTarget) => {
    if (account.environment != 'live') return switchRequest.run({ id: account.id })
    Modal.confirm({
      title: t('connector_live_title', { name: account.name }),
      description: t('connector_live_detail'),
      confirmLabel: t('connector_live_confirm'),
      cancelLabel: t('review_cancel'),
      onConfirm: () => switchRequest.run({ id: account.id, confirm_live: true })
    })
  }

  return { switching: switchRequest.loading, onSwitch }
}

export default useAccountSwitch
