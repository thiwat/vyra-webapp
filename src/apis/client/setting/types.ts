import { Theme } from '@/atoms/theme/types'

export type RequestGetSettingInput = {
  code: string
}

export type RequestSetThemeInput = {
  theme?: Theme
}
