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

export function validAddToMapInputs({ username, title, latitude, longitude }) {
  // coordinates validation
  if (!isFinite(latitude) || !(Math.abs(latitude) <= 90)) {
    return false
  }
  if (!isFinite(longitude) || !(Math.abs(longitude) <= 180)) {
    return false
  }
  return username.length >= 3 && title.length >= 3
}

export const logout = () => {
  window.sessionStorage.clear()
  window.location.href = "/"
}

export const isAuthenticated = () => {
  return Boolean(window.sessionStorage.getItem("token"))
}
