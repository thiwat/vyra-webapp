export type RequestLoginInput = {
  username: string
  password: string
}

export type RequestRevokeTokenInput = {
  token: string
}

export type LoginResponse = {
  token: string
  /** seconds */
  expires_in?: number
  [key: string]: any
}
