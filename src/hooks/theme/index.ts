import { useRequest } from 'ahooks'
import { requestSetTheme } from '@/apis/client/setting'
import { useThemeState } from '@/atoms/theme'
import { ThemeMode } from '@/enums/theme'

/** Light/dark toggle: updates the atom immediately and persists the cookie via `/api/theme`. */
const useTheme = () => {
  const [theme, setTheme] = useThemeState()

  const setRequest = useRequest(requestSetTheme, {
    manual: true
  })

  const onToggle = () => {
    const newTheme = theme == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark
    setTheme(newTheme)
    setRequest.run({
      theme: newTheme
    })
  }

  return {
    theme,
    onToggle
  }
}

export default useTheme
