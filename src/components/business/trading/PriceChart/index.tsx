import { useRequest, useSize } from 'ahooks'
import { PointerEvent as ReactPointerEvent, useRef, useState } from 'react'
import { requestCandles } from '@/apis/client/trading'
import Segmented from '@/components/form/Segmented'
import { ChartScale, priceAtY, snapToTick, yAtPrice } from '@/utils/chart'
import { decimalsOf, formatAmount } from '@/utils/trading'
import Panel from '../Panel'
import { ChartLevel, PriceChartProps } from './types'

const INTERVALS = [
  { label: '1H', value: '1h' },
  { label: '15m', value: '15m' },
  { label: '5m', value: '5m' }
]
const REFRESH_MS = 5000
const PRICE_AXIS = 100
const GREEN = '#2ebd85'
const RED = '#ef5a5f'

const LEVEL_HIT_HEIGHT = 14

const PriceChart = ({
  symbol,
  price,
  tickSize,
  plan,
  entryEditable,
  onLevelChange
}: PriceChartProps) => {
  const box = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  // The scale stays frozen during a drag so the chart doesn't move under the cursor.
  const dragScale = useRef<ChartScale | null>(null)
  const [drag, setDrag] = useState<{ key: ChartLevel; price: number } | null>(null)
  const size = useSize(box)
  const [interval, setInterval] = useState('15m')
  const { data: candles } = useRequest(() => requestCandles({ symbol, interval }), {
    refreshDeps: [symbol, interval],
    pollingInterval: REFRESH_MS
  })

  const width = size?.width || 0
  const height = size?.height || 0
  const decimals = decimalsOf(tickSize)
  const showLevels = plan && plan.stop_distance_pct > 0
  const levels: { key: ChartLevel; label: string; value: number; color: string }[] = showLevels
    ? ([
        { key: 'entry', label: 'Entry', value: plan.entry_price, color: '#e8ebf0' },
        { key: 'sl', label: 'SL', value: plan.stop_loss_price, color: RED },
        { key: 'tp', label: 'TP', value: plan.take_profit_price, color: GREEN }
      ].map(level =>
        drag?.key == level.key ? { ...level, value: drag.price } : level
      ) as typeof levels)
    : []
  const entryLevel = levels[0]?.value

  const onDragMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag || !dragScale.current) return
    const top = svg.current.getBoundingClientRect().top
    const next = snapToTick(priceAtY(e.clientY - top, dragScale.current), tickSize)
    if (next == drag.price) return
    setDrag({ ...drag, price: next })
    onLevelChange?.(drag.key, next)
  }

  const onDragEnd = () => {
    setDrag(null)
    dragScale.current = null
  }

  const renderChart = () => {
    const count = Math.floor((width - PRICE_AXIS) / 9)
    const visible = (candles || []).slice(-count)
    if (!visible.length || count <= 0) return null

    const values = levels.map(l => l.value)
    const high = Math.max(...visible.map(c => c.high), ...values)
    const low = Math.min(...visible.map(c => c.low), ...values)
    const scale: ChartScale = dragScale.current || {
      high,
      low,
      pad: (high - low) * 0.06,
      height
    }
    const y = (v: number) => yAtPrice(v, scale)
    const right = width - PRICE_AXIS
    const step = right / count
    const grid = [1, 2, 3, 4, 5].map(i => low + ((high - low) * i) / 6)

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        ref={svg}
        className={'absolute inset-0 w-full h-full touch-none select-none'}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        role={'img'}
        aria-label={`${symbol} ${interval} candles with entry, stop and target lines`}
      >
        {grid.map(v => (
          <g key={v}>
            <line x1={0} x2={right} y1={y(v)} y2={y(v)} stroke={'#1c2029'} />
            <text x={right + 6} y={y(v) + 4} fill={'#7f8998'} fontSize={10} className={'num'}>
              {formatAmount(v, decimals)}
            </text>
          </g>
        ))}
        {levels.slice(1).map(level => (
          <rect
            key={level.label}
            x={0}
            width={right}
            y={Math.min(y(level.value), y(entryLevel))}
            height={Math.abs(y(level.value) - y(entryLevel))}
            fill={level.color}
            opacity={0.07}
          />
        ))}
        {visible.map((c, i) => {
          const x = i * step + step / 2
          const color = c.close >= c.open ? GREEN : RED
          const bodyWidth = Math.max(3, step * 0.62)
          return (
            <g key={c.time}>
              <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} stroke={color} />
              <rect
                x={x - bodyWidth / 2}
                width={bodyWidth}
                y={Math.min(y(c.open), y(c.close))}
                height={Math.max(1, Math.abs(y(c.open) - y(c.close)))}
                fill={color}
              />
            </g>
          )
        })}
        {levels.map(level => {
          const editable = level.key != 'entry' || entryEditable
          return (
            <g key={level.label}>
              <line
                x1={0}
                x2={right}
                y1={y(level.value)}
                y2={y(level.value)}
                stroke={level.color}
                strokeDasharray={'4 4'}
              />
              <rect
                x={right}
                y={y(level.value) - 9}
                width={PRICE_AXIS}
                height={18}
                fill={level.color}
              />
              <text
                x={right + 5}
                y={y(level.value) + 4}
                fill={'#0b0d10'}
                fontSize={10}
                fontWeight={600}
                className={'num'}
              >
                {`${level.label} ${formatAmount(level.value, decimals)}`}
              </text>
              {editable && (
                <rect
                  data-level={level.key}
                  x={0}
                  width={width}
                  y={y(level.value) - LEVEL_HIT_HEIGHT / 2}
                  height={LEVEL_HIT_HEIGHT}
                  fill={'transparent'}
                  className={'cursor-ns-resize'}
                  onPointerDown={e => {
                    svg.current.setPointerCapture(e.pointerId)
                    dragScale.current = scale
                    setDrag({ key: level.key, price: level.value })
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <Panel
      className={'flex flex-col h-[380px] lg:h-full'}
      title={
        <>
          {symbol}{' '}
          <span className={'num body-base'}>{price ? formatAmount(price, decimals) : ''}</span>
        </>
      }
      action={
        <Segmented small value={interval} options={INTERVALS} onChange={v => setInterval(v)} />
      }
    >
      <div ref={box} className={'relative flex-1 min-h-0'}>
        {renderChart()}
      </div>
    </Panel>
  )
}

export default PriceChart
