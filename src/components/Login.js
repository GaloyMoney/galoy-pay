import { gql, useMutation } from "@apollo/client"
import { navigate } from "hookrouter"
import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { validAuthCode, validPhone, reportError } from "../utils"
import Header from "./Header"
import "./Login.css"

const REQUEST_AUTH_CODE = gql`
  mutation userRequestAuthCode($input: UserRequestAuthCodeInput!) {
    mutationData: userRequestAuthCode(input: $input) {
      errors {
        message
      }
      success
    }
  }
`

const LOGIN = gql`
  mutation login($input: UserLoginInput!) {
    mutationData: userLogin(input: $input) {
      errors {
        message
      }
      authToken
    }
  }
`

export default function Login() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpGenerated, setOtpGenerated] = useState(false)

  const [requestAuthCode, { loading: requestAuthCodeLoading }] =
    useMutation(REQUEST_AUTH_CODE)
  const [login, { loading: userLoginLoading }] = useMutation(LOGIN)

  const PhoneForm = () => {
    async function submitPhone(event) {
      event.preventDefault()
      const { error, data } = await requestAuthCode({ variables: { input: { phone } } })
      if (error) {
        return reportError(error.message)
      }

      const { errors, success } = data.mutationData
      if (errors.length > 0) {
        return reportError(errors[0].message)
      }
      if (success) {
        setOtpGenerated(true)
      } else {
        reportError("Could not execute operation")
      }
    }

    return (
      <Form onSubmit={submitPhone}>
        <Form.Group size="lg">
          <Form.Control
            autoFocus
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validPhone(phone)}>
          Login
        </Button>
      </Form>
    )
  }

  const OTPForm = () => {
    async function submitOtp(event) {
      event.preventDefault()
      const { error, data } = await login({ variables: { input: { phone, code: otp } } })

      if (error) {
        return reportError(error.message)
      }

      const { errors, authToken } = data.mutationData

      if (errors.length > 0) {
        return reportError(errors[0].message)
      }

      if (authToken) {
        window.sessionStorage.setItem("token", authToken)
        navigate("/dashboard", true)
      } else {
        reportError("Could not execute operation")
      }
    }

    return (
      <Form onSubmit={submitOtp}>
        <Form.Group size="lg">
          <Form.Control
            autoFocus
            type="text"
            placeholder="Enter Auth Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validAuthCode(otp)}>
          Login
        </Button>
      </Form>
    )
  }

  return (
    <div>
      <Header />
      <div className="Login">
        {!otpGenerated && <PhoneForm />}
        {otpGenerated && <OTPForm />}
        {(requestAuthCodeLoading || userLoginLoading) && <p>Loading...</p>}
      </div>
    </div>
  )
}
