export function reportError(errorMesssage) {
  console.error(errorMesssage)
  alert(errorMesssage)
}

export function validPhone(phone) {
  return phone.length > 8 && phone.length <= 15 && phone.match(/^\+[1-9][0-9]{7,}$/)
}

export function validAuthCode(authCode) {
  return authCode.length === 6
}

export function validUsername(username) {
  return username.length >= 3 && username.match(/(?!^(1|3|bc1|lnbc1))^[0-9a-z_]{3,50}$/i)
}

export const logout = () => {
  window.sessionStorage.clear()
  window.location.href = "/"
}

export const isAuthenticated = () => {
  return Boolean(window.sessionStorage.getItem("token"))
}

export const formatDate = (timestamp) => new Date(timestamp * 1e3).toLocaleString()
export const formatNumber = (val) =>
  countDecimals(val) > 8 ? Number(val).toFixed(8) : val

const countDecimals = (val) => {
  if (Math.floor(val.valueOf()) === val.valueOf()) return 0
  return val.toString().split(".")[1].length || 0
}
