import type { ReactNode } from 'react'
import { createRoot, Root } from 'react-dom/client'

/*
 * Imperative render used by Modal.confirm / Modal.warn / ChangePassword.open.
 * Same signature as rc-util's `render`/`unmount`, which no longer works on React 19
 * (react-dom no longer exports `render`/`createRoot`).
 */

const MARK = '__app_react_root__'

type Container = (Element | DocumentFragment) & { [MARK]?: Root }

export const render = (node: ReactNode, container: Container) => {
  const root = container[MARK] || createRoot(container)
  root.render(node)
  container[MARK] = root
}

export const unmount = (container: Container) => {
  // defer so it never runs during a React render of the same root
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()
    delete container[MARK]
  })
}
