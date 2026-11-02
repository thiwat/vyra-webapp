import { describe, expect, it } from 'vitest'
import { buildCalendarCells, shiftMonth } from './calendar'

describe('buildCalendarCells', () => {
  it('starts weeks on Monday', () => {
    // 1 Nov 2026 is a Sunday, so six empty cells come first.
    const cells = buildCalendarCells('2026-11')
    expect(cells.slice(0, 6).every(c => c === null)).toBe(true)
    expect(cells[6]).toMatchObject({ day: '2026-11-01', date: 1 })
  })

  it('needs no padding when the month starts on Monday', () => {
    expect(buildCalendarCells('2026-06')[0]).toMatchObject({ date: 1 })
  })

  it('covers every day and attaches results', () => {
    const cells = buildCalendarCells('2026-11', [{ day: '2026-11-02', pnl: -0.4, trades: 2 }])
    expect(cells.filter(Boolean)).toHaveLength(30)
    expect(cells.find(c => c?.day == '2026-11-02').summary.pnl).toBe(-0.4)
  })
})

describe('shiftMonth', () => {
  it('crosses year boundaries', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
  })
})
