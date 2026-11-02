# Webapp Conventions

Next.js 16 **Pages Router** + BFF, React 19, jotai, rc-field-form, Tailwind 4, Vitest. Node 22. Mobile-first.

## 1. Structure & naming
```
src/
  apis/types.ts                 ApiError, ListResponse, toApiError
  apis/client/<domain>/{index,types}.ts   browser -> /api/* (request.ts)
  apis/server/<domain>/{index,types}.ts   BFF -> API_GATEWAY (request.ts, cookie.ts, app.ts)
  pages/api/**                  thin proxies, one file per route
  pages/**                      pages; no logic beyond wiring a service hook
  services/<feature>/{index,types}.ts     page "controller" hooks (ahooks useRequest)
  atoms/<name>/{index,types}.ts           jotai state
  hooks/<snake_name>/{index,types}.ts     reusable UI hooks
  components/{ui,form,layouts,business/<domain>}/<PascalName>/{index.tsx,types.ts}
  constants/ enums/ utils/ styles/
```
- Folders: `snake_case` for apis/services/hooks/atoms, `PascalCase` for components. Files are always `index` + `types`.
- Default export for components/hooks/services; named exports for api functions (`requestXxx`) and utils.
- Imports: alias `@/…`; lodash per method (`import _get from 'lodash/get'`).
- Enums are string enums with key == value: `enum UserRole { admin = 'admin', member = 'member' }`.
- **All API/DB fields are snake_case** (`first_name`, `page_size`). Never camelCase a payload.
- Style: Prettier (no semicolons, single quotes, width 100). `npm run format`.

## 2. Adding a feature (canonical example: `order`)
```ts
// apis/server/order/index.ts  (BFF -> backend, always takes headers last)
export const requestCancelOrder = (key: string, data: RequestCancelOrderInput, headers: any) =>
  request(`/order/${key}/cancel`, 'POST', data, headers)

// pages/api/order/[key]/cancel.ts  (thin proxy)
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const result = await requestCancelOrder(req.query.key as string, req.body, getHeadersFromRequest(req))
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}
export default handler

// apis/client/order/index.ts  (browser -> BFF, one object argument)
export const requestCancelOrder = ({ key, data }: RequestCancelOrderInput) =>
  request(`/order/${key}/cancel`, 'POST', data)

// services/order_cancel/index.ts  (page controller)
const useOrderCancel = ({ onSuccess }: OrderCancelServiceProps) => {
  const [form] = useForm()
  const cancelRequest = useRequest(requestCancelOrder, {
    manual: true,
    onSuccess: r => {
      toast.success(t('order_cancel_success'))
      onSuccess?.(r)
    },
    onError: e => e.code == 'already_shipped' && form.setErrors({ reason: t('order_error_shipped') })
  })
  const onSubmit = (values: any) => cancelRequest.run({ key: values.code, data: { reason: values.reason } })
  return { form, loading: cancelRequest.loading, onSubmit }
}
export default useOrderCancel
```
The page only wires the service: `const { form, loading, onSubmit } = useOrderCancel({})`.
Add the menu entry in `constants/menu.ts` and `order_*` keys in `utils/translate.ts`.

**Generic CRUD (no new API code):** `/api/entity/[entity]` (GET list, POST) and `/api/entity/[entity]/[key]`
(GET, PUT, DELETE) proxy to `/<entity>`. Add the name to `enums/entity.ts`; map differing backend paths in
`MAP_ENTITY` (`apis/server/entity`). Entity names must match `/^[a-z0-9_]+$/`.

```tsx
// pages/order/index.tsx
const { data, loading, keyword, sort, filter, pageInfo, onSearch, onSort, onFilter,
  onChangePage, onChangePageSize, onRefresh } = useList({ entity: Entity.order, baseFilter: { is_active: true } })
<ListHeader keyword={keyword} onSearch={onSearch} onRefresh={onRefresh} />
<QuickFilter value={filter} options={[{ label: t('order_status_paid'), value: 'paid', field: 'status' }]} onChange={onFilter} />
<Table data={data} loading={loading} sort={sort} onSort={onSort} columns={[
  { label: t('order_no'), keyData: 'order_no', sorter: true },
  { label: t('order_created_at'), keyData: 'created_at', type: ColumnType.datetime },
  { label: '', keyData: 'code', type: ColumnType.action, align: 'right' }
]} />
<TableFooter pageInfo={pageInfo} onChangePage={onChangePage} onChangePageSize={onChangePageSize} />

// pages/order/[key].tsx  ('create' = create mode)
const { form, mode, submitting, onSubmit } = useDetail({ entity: Entity.order, key: router.query.key as string,
  prepareBeforeSave: v => ({ ...v, amount: +v.amount }) })
```
List URL state: `q` keywords, `s` sort (`-field` = desc), `f` filter (`utils/query` encode/decode), `p`, `ps`.
Backend contract: `?page&page_size&keywords&filter(qs)&sort` -> `{ page, page_size, total, total_page, rows }`.

## 3. BFF / API layer
- Browser -> `/api/*` only; `API_GATEWAY` is read server side (**no `NEXT_PUBLIC_` vars**).
- The token lives only in the httpOnly `token` cookie set by `/api/auth/login` (`COOKIE_*` options); it is
  stripped from responses/pageProps. `getHeadersFromRequest(req)` -> `Authorization: Bearer …` + client IP/UA.
  The login route adds `SYSTEM_APP_KEY` / `SYSTEM_SECRET_KEY`.
- **One error shape** everywhere: `{ statusCode, code, message: string[] }`.
  - server `request()` throws `{ status, error: ApiError }`; routes answer `sendError(res, e)` /
    `methodNotAllowed(res, ['GET'])`.
  - client `request()` throws `RequestError` (`message` = first message, `code`, `status`, `messages`).
  - 401/403 -> `window.location` to `/login?redirect_url=<current path>` (except on public pages).
  - every other error is toasted by the global handler. Opt out per call
    (`request(path, 'POST', body, { silent: true })`) or globally (`setRequestErrorHandler(fn | null)`).
    Services therefore do **not** toast errors; they only add field errors / special cases in `onError`.

## 4. Forms (`components/form`)
```tsx
const [form] = useForm()
<Form form={form} onFinish={onSubmit} disabled={readOnly}>
  <FormItem label={t('profile_email')} name={'email'} required rules={[validateEmail]} description={t('…')}>
    <Input type={'email'} />
  </FormItem>
  <FormItem label={t('profile_mobile_no')} name={'mobile_no'} normalize={normalizeMobileNo} rules={[validateMobileNo]}>
    <Input type={'tel'} />
  </FormItem>
  <FormList name={'items'}>{fields => …}</FormList>
  <Button type={'primary'} htmlType={'submit'}>{t('common_button_save')}</Button>
</Form>
form.setErrors({ email: 'Duplicate email' })   // server-side field errors
const amount = useWatch('amount', form)
```
- Validates on blur; the first invalid field scrolls into view on submit. Every control is controlled
  `{ value, onChange }` and gets `id`/`disabled` from FormItem:
  `Input` (`type` password|number|email|tel, `normalize`, number `allowDecimal/min/max`), `Select`
  (`options`, `mode` single|multiple|tags, `onEndReached`, `loading`), `AdvanceSelect` (`entity`,
  `labelFormat: '${ name }'`, `valueFormat: '${ code }'`), `Checkbox`, `Switch`, `RadioGroup`,
  `DatePicker` (`mode` date -> `'DD/MM/YYYY'`, datetime -> `Date`, time -> `'HH:mm'`), `Upload`
  (base64 `{ file_name, size, image_data, file_type }` -> send with `requestUpload`), `PinInput`
  (`length`, auto-submits the form), `ColorPicker`, `Display`.
- Rules: `utils/rules.ts` (`validateEmail`, `validatePassword(8)`, `validateConfirmPassword`, …).
  Normalizers: `utils/normalize.ts`. Regex: `utils/regex.ts`.

## 5. UI kit (`components/ui`)
`Button` (`type` primary|default|secondary|danger|danger_primary, `size`, `icon`, `link`), `Card`, `Badge`,
`Collapse`, `Tabs`, `Dropdown` (`options`, `onClick`, `alignment`), `Drawer`, `Modal`
(`Modal.confirm({ title, description, onConfirm })`, `Modal.warn`), `Table` + `Paginate` + `TableFooter`,
`ListHeader`, `SearchInput`, `QuickFilter`, `RefreshButton`, `PreviewImage`, `BottomBar`,
`Icon` (`<Icon name={'House'} size={20} weight={'fill'} />`, any Phosphor name).
Imperative components render with `utils/render` (React 19 safe), e.g. `ChangePassword.open({ onSuccess })`.

## 6. State (jotai)
```ts
// atoms/cart/index.ts
export const cartAtom = atom<Cart>({})
export const useCartState = () => useAtom(cartAtom)
export const useCartStateValue = () => useAtomValue(cartAtom)
export const useSetCartState = () => useSetAtom(cartAtom)
```
Existing atoms: `profile`, `settings`, `theme`, seeded in `_app` (jotai `Provider` + `useHydrateAtoms`).
Keep page data in services (useRequest); use atoms only for app-wide state.

## 7. App bootstrap & auth guard (`pages/_app.tsx`)
- `getInitialProps` (server only, via dynamic `import('@/apis/server/app')`): token cookie -> `GET /user/me`,
  `GET /setting/site`, `theme` cookie -> `{ authenticated, profile, settings, theme }`. Invalid token -> cookie cleared.
- Client guard (once): logged out on a private page -> `/login?redirect_url=…`; logged in on a page in
  `NOT_REQUIRE_AUTH` (`constants/auth.ts`) -> `redirect_url` or `/`. Login honours `redirect_url`
  (`utils/url.getSafeRedirect` allows only relative paths).
- Renders `Theme`, `Layout`, `Toaster` and portals `#drawer-root`, `#modal-root`, `#print-root`.

## 8. Layouts & mobile
- `hooks/layout` picks `LayoutType.login` for `LOGIN_LAYOUT_PAGES`, else `main`.
- Main layout: sticky header; below `md` a hamburger opens `MobileMenu` (Drawer with profile, menu,
  change password, logout); from `md` an inline `Menu` + profile `Dropdown`. Content is
  `max-w-[1024px]` centered with `px-4 md:px-6`.
- Menu config `constants/menu.ts`: `{ label: t('menu_x'), icon: 'House', href: '/x', roles?: [UserRole.admin], children? }`;
  `utils/menu.prepareMenu` hides items whose `roles` exclude `profile.role`. `HIDE_MENU` pages show a back link.
- Write mobile-first Tailwind (`grid-cols-1 md:grid-cols-2`). Use `useScreenSize()` (SSR-safe,
  `{ width, height, isMobile }`) only for structural switches; breakpoint in `utils/screen.ts` (768).

## 9. Theming & Tailwind 4
- CSS-first config in `styles/global.css` (`@theme`). Tokens: `primary`, `primary-50…900`, `secondary`,
  `plane` (page bg), `card`, `line` (borders), `font`, `font-dark`, `label`, `icon`, `disabled`,
  `success`, `error`, `warning`. Opacity modifiers work: `bg-primary/10`.
- Runtime values: `components/layouts/Theme.tsx` sets `--color-primary-rgb` / `--color-secondary-rgb` from
  `settings.primary_color` / `dark_primary_color` / `secondary_color`, and light/dark surface tokens from
  `constants/theme.ts`. Toggle with `hooks/theme` (persists via `POST /api/theme`).
- Typography utilities (use instead of raw text sizes): `title-hero`, `title-bold`, `header-bold`,
  `header-base`, `header-subtitle-strong|light`, `header-field-title`, `body-emphasis`, `body-strong`,
  `body-base`, `paragraph-base|small`, `tagline-medium|base|small|small-bold`. Override color with `!text-primary`.
  Font: Prompt via `next/font` (`--font-prompt` = Tailwind `font-sans`).

## 10. i18n & dates
- `t('key', { name })` from `utils/translate.ts` (flat dictionary, lodash `${ name }` interpolation).
  Prefix keys by area: `common_*`, `login_*`, `menu_*`, `modal_*`, `profile_*`, then `<feature>_*`.
  `setTranslate(dict)` merges more keys at runtime. Never hard-code UI text in components.
- Import dayjs only from `@/utils/dayjs` (locale `th`, utc + timezone `Asia/Bangkok`, customParseFormat).
  Display with `formatDatetime(v, 'DD MMM YYYY')`, `formatDate`, `formatNumber(v, allowDecimal)`.

## 11. Optional: LINE LIFF
`utils/liff.ts` loads `@line/liff` lazily. `_app` calls `initLiff(settings.liff_id)` only when the
backend site setting has `liff_id`. Helpers: `isInLiff()`, `lineLogin()`, `getLineToken()`, `closeLiff()`.
To exchange a LINE token for an app token, add `apis/server/auth.requestLineLogin` + `pages/api/auth/line.ts`
that sets the same `token` cookie. Remove the file, the `_app` call and the dependency if unused.

## 12. Env vars, commands, tests
- Env (`.env.example`, server side only): `API_GATEWAY`, `SYSTEM_APP_KEY`, `SYSTEM_SECRET_KEY`, `COOKIE_SECURE`,
  `COOKIE_HTTP_ONLY`, `COOKIE_SAME_SITE`, `PORT`, `NODE_ENV`. Never commit `.env`.
- `npm run dev` (port 4002) · `build` · `lint` · `typecheck` · `test` · `format`. Docker: multi-stage
  `Dockerfile` (standalone output); `docker compose up` serves port 4002 with `env_file: .env`.
- Tests (Vitest + Testing Library) live next to the code as `*.test.ts(x)`: utils as pure functions, atoms
  with `renderHook` inside `<Provider>`, components with `render` + `fireEvent`.
