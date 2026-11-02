export const isEmail = (value: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(value)
}

/** Thai mobile/landline: 0 + 8-9 digits. */
export const isMobileNo = (value: string): boolean => {
  return /^0[1-9]{1}[0-9]{7,8}$/.test(value)
}
