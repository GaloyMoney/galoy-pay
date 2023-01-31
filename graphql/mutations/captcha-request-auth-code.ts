import { gql } from "../__generated__"

export const CAPTCHA_REQUEST_AUTH_CODE = gql(/* GraphQL */ `
  mutation captchaRequestAuthCode($input: CaptchaRequestAuthCodeInput!) {
    captchaRequestAuthCode(input: $input) {
      errors {
        message
      }
      success
    }
  }
`)
