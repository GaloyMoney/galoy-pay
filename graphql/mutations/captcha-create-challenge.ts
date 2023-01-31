import { gql } from "../__generated__"

export const CAPTCHA_CREATE_CHALLENGE = gql(/* GraphQL */ `
  mutation captchaCreateChallenge {
    captchaCreateChallenge {
      errors {
        message
      }
      result {
        id
        challengeCode
        newCaptcha
        failbackMode
      }
    }
  }
`)
