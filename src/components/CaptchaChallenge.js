import * as React from "react"
import PropTypes from "prop-types"
import { gql, useMutation } from "@apollo/client"

import AuthCodeForm from "./AuthCodeForm"

const CAPTCHA_CREATE_CHALLENGE = gql`
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
`

const CAPTCHA_REQUEST_AUTH_CODE = gql`
  mutation captchaRequestAuthCode($input: CaptchaRequestAuthCodeInput!) {
    captchaRequestAuthCode(input: $input) {
      errors {
        message
      }
      success
    }
  }
`

const CaptchaChallenge = ({ phoneNumber }) => {
  const [createCaptchaChallenge, { loading: createLoading }] = useMutation(
    CAPTCHA_CREATE_CHALLENGE,
  )
  const [requestCaptchaAuthCode, { loading: requestLoading }] = useMutation(
    CAPTCHA_REQUEST_AUTH_CODE,
  )

  const [captchaState, setCaptchaState] = React.useState({ status: "loading" })

  const captchaHandler = React.useCallback(
    (captchaObj) => {
      const onSuccess = async () => {
        const result = captchaObj.getValidate()
        const { errorsMessage } = await requestCaptchaAuthCode({
          variables: {
            input: {
              phone: phoneNumber,

              challengeCode: result.geetest_challenge,
              validationCode: result.geetest_validate,
              secCode: result.geetest_seccode,
            },
          },
        })

        setCaptchaState({ status: errorsMessage ? "error" : "success", errorsMessage })
      }
      captchaObj.appendTo("#captcha")
      captchaObj
        .onReady(() => {
          setCaptchaState({ status: "ready" })
          captchaObj.verify()
        })
        .onSuccess(onSuccess)
        .onError((err) => {
          console.debug("[Captcha error]:", err)
          setCaptchaState({
            status: "error",
            errorsMessage: "Invalid verification. Please try again",
          })
        })
    },
    [phoneNumber, requestCaptchaAuthCode],
  )

  React.useEffect(() => {
    const initCaptcha = async () => {
      const { data, errorsMessage } = await createCaptchaChallenge()

      const result = data?.captchaCreateChallenge?.result
      if (!errorsMessage && result) {
        const { id, challengeCode, newCaptcha, failbackMode } = result
        window.initGeetest(
          {
            gt: id,
            challenge: challengeCode,
            offline: failbackMode,
            // eslint-disable-next-line camelcase
            new_captcha: newCaptcha,

            lang: "en",
            product: "bind",
          },
          captchaHandler,
        )
      }
    }
    initCaptcha()
  }, [captchaHandler, createCaptchaChallenge])

  if (captchaState.status === "success") {
    return <AuthCodeForm phoneNumber={phoneNumber} />
  }

  const isLoading = captchaState.status === "loading" || createLoading || requestLoading
  const hasError = !isLoading && captchaState.status === "error"

  return (
    <div className="captcha-challenge">
      <div className="intro">{"Verify you are human"}</div>
      <div id="captcha">{isLoading && <div className="loading">Loading...</div>}</div>
      {hasError && <div className="error">{captchaState.errorsMessage}</div>}
    </div>
  )
}

CaptchaChallenge.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
}

export default CaptchaChallenge
