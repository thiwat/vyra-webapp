export type SettingsMetaData = {
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

/** Public site settings from the backend (`GET /setting/site`). */
export type Settings = {
  name?: string
  primary_color?: string
  dark_primary_color?: string
  secondary_color?: string
  logo?: string
  meta_data?: SettingsMetaData
  /** OPTIONAL: LINE LIFF id. When set, `_app` initialises LIFF. */
  liff_id?: string
}
