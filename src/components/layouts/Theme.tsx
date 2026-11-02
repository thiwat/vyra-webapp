import { Prompt } from 'next/font/google'
import Head from 'next/head'
import { useMemo } from 'react'
import { useThemeStateValue } from '@/atoms/theme'
import {
  DEFAULT_DARK_PRIMARY_COLOR,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR
} from '@/constants/theme'
import { ThemeMode } from '@/enums/theme'
import { getRGBColor } from '@/utils/color'
import { buildTheme } from '@/utils/theme'
import { ThemeProps } from './types'

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

/**
 * Injects the runtime theme as CSS variables:
 * - `--color-primary-rgb` / `--color-secondary-rgb` from site settings (Tailwind `primary`, `secondary`)
 * - surface/font tokens of the current light/dark theme (constants/theme.ts)
 * - `--font-prompt` (next/font)
 */
const Theme = ({ primaryColor, darkPrimaryColor, secondaryColor }: ThemeProps) => {
  const theme = useThemeStateValue()

  const themeColors = useMemo(() => buildTheme(theme), [theme])

  const primary =
    theme == ThemeMode.dark
      ? darkPrimaryColor || primaryColor || DEFAULT_DARK_PRIMARY_COLOR
      : primaryColor || DEFAULT_PRIMARY_COLOR

  return (
    <Head>
      <style>
        {`
        :root {
          ${getRGBColor(primary, 'primary') || getRGBColor(DEFAULT_PRIMARY_COLOR, 'primary')}
          ${getRGBColor(secondaryColor || DEFAULT_SECONDARY_COLOR, 'secondary')}
          ${themeColors}
          --font-prompt: ${prompt.style.fontFamily};
          color-scheme: ${theme == ThemeMode.dark ? 'dark' : 'light'};
        }
      `}
      </style>
    </Head>
  )
}

export default Theme
