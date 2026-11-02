/** Move focus to the next <input> on the page (Enter-to-next behaviour of Input). */
export const focusNextInput = (offset: number = 1) => {
  const allInputs = Array.from(document.querySelectorAll('input'))
  const currentIndex = allInputs.findIndex(e => e == document.activeElement)
  const nextIndex = currentIndex + offset
  if (nextIndex >= allInputs.length) return
  allInputs[nextIndex]?.focus()
}
