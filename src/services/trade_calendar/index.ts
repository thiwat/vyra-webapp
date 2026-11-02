import { useRequest } from 'ahooks'
import { useState } from 'react'
import { requestCalendar } from '@/apis/client/trading'
import { useOverviewStateValue } from '@/atoms/overview'
import { buildCalendarCells, shiftMonth } from '@/utils/calendar'
import dayjs from '@/utils/dayjs'

const useTradeCalendar = () => {
  const { data: overview } = useOverviewStateValue()
  const connectorId = overview?.connector_id
  const [month, setMonth] = useState(() => dayjs().tz('Asia/Bangkok').format('YYYY-MM'))

  const { data } = useRequest(() => requestCalendar({ month }), {
    ready: !!connectorId,
    refreshDeps: [month, connectorId]
  })

  return {
    month,
    summary: data,
    cells: buildCalendarCells(month, data?.days),
    today: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD'),
    onPrevious: () => setMonth(shiftMonth(month, -1)),
    onNext: () => setMonth(shiftMonth(month, 1))
  }
}

export default useTradeCalendar
