/* Surface/font tokens that change with light/dark mode (injected as CSS vars by layouts/Theme). */

export const LIGHT_THEME = {
  plane: '#F5F5F7',
  card: '#FFFFFF',
  font: '#606060',
  'font-dark': '#222222',
  line: '#DAE1EB'
}

export const DARK_THEME = {
  plane: '#0B0D10',
  card: '#12151A',
  font: '#A0A9B8',
  'font-dark': '#E8EBF0',
  line: '#232832'
}

/** Fallbacks when the backend site settings have no colors. */
export const DEFAULT_PRIMARY_COLOR = '#2563EB'
export const DEFAULT_DARK_PRIMARY_COLOR = '#3C83F6'
export const DEFAULT_SECONDARY_COLOR = '#3154a5'
