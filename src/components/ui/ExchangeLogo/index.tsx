import { ExchangeLogoProps } from './types'

const BINANCE_YELLOW = '#F0B90B'
const BINANCE_SHAPES = [
  '12,3 17.5,8.5 15.7,10.3 12,6.6 8.3,10.3 6.5,8.5',
  '12,21 6.5,15.5 8.3,13.7 12,17.4 15.7,13.7 17.5,15.5',
  '6,9.5 8.5,12 6,14.5 3.5,12',
  '18,9.5 20.5,12 18,14.5 15.5,12',
  '12,9.5 14.5,12 12,14.5 9.5,12'
]

const ExchangeLogo = ({ size = 16 }: ExchangeLogoProps) => (
  <svg viewBox={'0 0 24 24'} width={size} height={size} aria-hidden={true} className={'shrink-0'}>
    {BINANCE_SHAPES.map(points => (
      <polygon key={points} points={points} fill={BINANCE_YELLOW} />
    ))}
  </svg>
)

export default ExchangeLogo
