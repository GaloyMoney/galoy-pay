export function validatePhone(phone) {
  return phone.length > 10 && phone.length <= 15;
}

export function validateOtp(otp) {
  return otp.length === 6;
}
