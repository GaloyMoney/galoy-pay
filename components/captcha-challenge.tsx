"use client"

import { useCallback, useEffect, useState } from "react"

import AuthCodeForm from "./auth-code-form"
import {
  useCaptchaCreateChallengeMutation,
  useCaptchaRequestAuthCodeMutation,
} from "../generated"
import config from "../config"

type GraphQLError = {
  message: string
}

const CaptchaChallenge: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const [createCaptchaChallenge, { loading: createLoading }] =
    useCaptchaCreateChallengeMutation()
  const [requestCaptchaAuthCode, { loading: requestLoading }] =
    useCaptchaRequestAuthCodeMutation()
  const [captchaState, setCaptchaState] = useState<{
    status: "loading" | "error" | "ready" | "success"
    errorsMessage?: string
  }>({ status: "loading" })
  const { GALOY_AUTH_ENDPOINT } = config()

  const captchaHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (captchaObj: any) => {
      const onSuccess = async () => {
        const result = captchaObj.getValidate()

        try {
          const { errors, data } = await requestCaptchaAuthCode({
            variables: {
              input: {
                phone: phoneNumber,

                challengeCode: result.geetest_challenge,
                validationCode: result.geetest_validate,
                secCode: result.geetest_seccode,
              },
            },
          })

          const gqlErrors = errors ?? data?.captchaRequestAuthCode?.errors

          setCaptchaState({
            status: data?.captchaRequestAuthCode?.success ? "success" : "error",
            errorsMessage: gqlErrors?.map((err: GraphQLError) => err.message).join(","),
          })
        } catch (error) {
          console.debug("[Captcha error]:", error)

          setCaptchaState({
            status: "error",
            errorsMessage: "Invalid verification. Please try again",
          })
        }
      }
      captchaObj.appendTo("#captcha")
      captchaObj
        .onReady(() => {
          setCaptchaState({ status: "ready" })
          captchaObj.verify()
        })
        .onSuccess(onSuccess)
        .onError((err: unknown) => {
          console.debug("[Captcha err]:", err)
          setCaptchaState({
            status: "error",
            errorsMessage: "Invalid verification. Please try again",
          })
        })
    },
    [phoneNumber, requestCaptchaAuthCode],
  )

  useEffect(() => {
    const initCaptcha = async () => {
      try {
        await clearCookies()
        const { data, errors } = await createCaptchaChallenge()

        const gqlErrors = errors ?? data?.captchaCreateChallenge?.errors

        if (gqlErrors && gqlErrors.length > 0) {
          setCaptchaState({
            status: "error",
            errorsMessage: gqlErrors?.map((err: GraphQLError) => err.message).join(","),
          })
        }

        const result = data?.captchaCreateChallenge?.result

        if (result) {
          const { id, challengeCode, newCaptcha, failbackMode } = result
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).initGeetest(
            {
              gt: id,
              challenge: challengeCode,
              offline: failbackMode,
              new_captcha: newCaptcha,

              lang: "en",
              product: "bind",
            },
            captchaHandler,
          )
        } else {
          throw new Error("No result from createCaptchaChallenge")
        }
      } catch (error) {
        console.debug("[Init captcha err]:", error)

        setCaptchaState({
          status: "error",
          errorsMessage: "Invalid verification. Please try again",
        })
      }
    }
    initCaptcha()
  }, [captchaHandler, createCaptchaChallenge])

  if (captchaState.status === "success") {
    return <AuthCodeForm phoneNumber={phoneNumber} />
  }

  const isLoading = captchaState.status === "loading" || createLoading || requestLoading
  const hasError = !isLoading && captchaState.status === "error"

  const resetPage = async () => {
    await clearCookies()
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/"
  }

  const clearCookies = () => {
    return fetch(GALOY_AUTH_ENDPOINT + "/clearCookies", {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    })
  }

  return (
    <div className="captcha-challenge">
      <div className="intro">{"Verify you are human"}</div>
      <div id="captcha">{isLoading && <div className="loading">Loading...</div>}</div>
      {hasError && (
        <>
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            {captchaState.errorsMessage}
          </div>
          <a onClick={resetPage} style={{ cursor: "pointer" }} className="underline">
            Reload
          </a>
        </>
      )}
    </div>
  )
}

export default CaptchaChallenge
