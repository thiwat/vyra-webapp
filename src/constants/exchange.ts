/** Labels and hosts shown for a connector. vyra-core holds the URLs it actually calls. */
export const BASE_URLS: Record<string, string> = {
  demo: 'https://demo-fapi.binance.com',
  live: 'https://fapi.binance.com'
}

export const EXCHANGE_OPTIONS = [{ label: 'Binance', value: 'binance' }]
export const MARKET_OPTIONS = [{ label: 'USDⓈ-M Futures', value: 'usdm_futures' }]

export const DEFAULT_CONNECTOR = {
  exchange: 'binance',
  market: 'usdm_futures',
  environment: 'demo'
}

/** Defaults for a new bot. vyra-core applies the same risk defaults. */
export const DEFAULT_BOT = {
  strategy: 'breakout_1h',
  symbol: 'ETHUSDT',
  risk_pct: 2,
  max_daily_loss_pct: 6
}
