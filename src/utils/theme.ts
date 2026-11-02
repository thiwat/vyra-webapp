import { DARK_THEME, LIGHT_THEME } from '@/constants/theme'
import { ThemeMode } from '@/enums/theme'

/** CSS custom properties for the surface/font tokens of a theme. */
export const buildTheme = (theme: ThemeMode | string): string => {
  const colors = theme == ThemeMode.dark ? DARK_THEME : LIGHT_THEME

  const res = []
  for (const key in colors) {
    res.push(`--color-${key}: ${colors[key]};`)
  }

  return res.join('\n')
}
