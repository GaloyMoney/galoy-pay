export const getOS = () => {
  // @ts-expect-error: opera browser property is not a standard thing
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return undefined
  }

  // Non-Google Huawei detection from: https://stackoverflow.com/questions/66048820
  if (/HMSCore\//.test(userAgent) && !/GMS\//.test(userAgent)) {
    return "huawei"
  }

  if (/android/i.test(userAgent)) {
    return "android"
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  // @ts-expect-error: MSStream browser property is not a standard thing
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios"
  }

  return undefined
}
