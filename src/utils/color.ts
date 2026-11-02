/** "#003a70" -> "--color-primary-rgb: 0, 58, 112;" (consumed by the Tailwind tokens in global.css) */
export const getRGBColor = (hex: string, type: string): string => {
  if (!hex) return ''
  let color = hex.replace(/#/g, '')
  if (color.length === 3) {
    color = color
      .split('')
      .map(i => i + i)
      .join('')
  }
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  if ([r, g, b].some(i => isNaN(i))) return ''
  return `--color-${type}-rgb: ${r}, ${g}, ${b};`
}
