export function validatePhone(phone) {
  return phone.length > 10 && phone.length <= 15
}

export function validateOtp(otp) {
  return otp.length === 6
}

export function validateUsername(username) {
  return username.length >= 3
}

export function validateAddToMapInputs(username, title, latitude, longitude) {
  //coordinate validation
  if (!isFinite(latitude) || !(Math.abs(latitude) <= 90)) {
    return false
  }

  if (!isFinite(longitude) || !(Math.abs(longitude) <= 180)) {
    return false
  }

  if (!validateUsername(username)) {
    return false
  }

  return title.length >= 3
}

export const logout = () => {
  sessionStorage.clear()
  window.location.href = '/'
}

export const isAuthenticated = () => {
  return !!sessionStorage.getItem('token')
}
