import { DaySummary } from '@/apis/client/trading/types'
import dayjs from '@/utils/dayjs'

export type CalendarCell = { day: string; date: number; summary?: DaySummary } | null

export const shiftMonth = (month: string, by: number): string =>
  dayjs(`${month}-01`).add(by, 'month').format('YYYY-MM')

/** Weeks start on Monday. Leading nulls pad the first week. */
export const buildCalendarCells = (month: string, days: DaySummary[] = []): CalendarCell[] => {
  const first = dayjs(`${month}-01`)
  const padding = (first.day() + 6) % 7
  const cells: CalendarCell[] = Array(padding).fill(null)
  for (let date = 1; date <= first.daysInMonth(); date++) {
    const day = first.date(date).format('YYYY-MM-DD')
    cells.push({ day, date, summary: days.find(d => d.day == day) })
  }
  return cells
}
