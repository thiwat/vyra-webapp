import { Bot } from '@/apis/client/bot/types'

export type BotHeatmapProps = {
  rows: Bot[]
  onTileClick?: (bot: Bot) => void
}
