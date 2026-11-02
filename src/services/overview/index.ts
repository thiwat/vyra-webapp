import { useRequest } from 'ahooks'
import { requestOverview } from '@/apis/client/trading'
import { useSetOverviewState } from '@/atoms/overview'

const POLL_MS = 2000

/** Keeps the app-wide trading state fresh. Mounted once, in the main layout. */
const useOverview = () => {
  const setOverview = useSetOverviewState()

  return useRequest(requestOverview, {
    pollingInterval: POLL_MS,
    onSuccess: data => setOverview({ data }),
    onError: () => setOverview(state => ({ ...state, offline: true }))
  })
}

export default useOverview
