/** Backend entities reachable through the generic `/api/entity/[entity]` proxy. */
export enum Entity {
  connector = 'connector',
  trade = 'trade',
  user = 'user'
}

/** Codes for `/api/setting/[code]`. */
export enum Setting {
  site = 'site'
}
