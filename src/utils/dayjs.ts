import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/th'

export const DEFAULT_TIMEZONE = 'Asia/Bangkok'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.locale('th')
dayjs.tz.setDefault(DEFAULT_TIMEZONE)

export type { Dayjs } from 'dayjs'

export default dayjs
