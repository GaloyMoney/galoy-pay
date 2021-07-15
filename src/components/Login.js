import { gql, useMutation } from "@apollo/client"
import { navigate } from "hookrouter"
import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { validateOtp, validatePhone } from "../utils"
import Header from "./Header"
import "./Login.css"

const GENERATE_OTP = gql`
  mutation requestPhoneCode($phone: String!) {
    requestPhoneCode(phone: $phone) {
      success
    }
  }
`

const LOGIN = gql`
  mutation login($phone: String!, $otp: Int!) {
    login(phone: $phone, code: $otp) {
      token
    }
  }
`

export default function Login() {
  const [phone, setPhone] = useState("")
  const [otpGenerated, setOtpGenerated] = useState(false)
  const [otp, setOtp] = useState("")

  function setAuthenticated(token) {
    sessionStorage.setItem("token", token)
  }

  const [generateOTP, { loading: otpGenerating }] = useMutation(GENERATE_OTP, {
    onCompleted({ requestPhoneCode: { success } }) {
      setOtpGenerated(true)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
    },
  })

  function submitPhone(event) {
    event.preventDefault()
    generateOTP({ variables: { phone } })
  }

  const [login] = useMutation(LOGIN, {
    onCompleted({ login: { token } }) {
      if (!token) {
        alert("Incorrect OTP")
      }
      setAuthenticated(token)
      navigate("/dashboard", true)
    },
    onError(error) {
      console.error(error.message)
    },
  })

  function submitOtp(event) {
    event.preventDefault()
    login({ variables: { phone, otp: parseInt(otp) } })
  }

  return (
    <div>
      <Header />
      <div className="Login">
        {!otpGenerated && (
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
            <Button block size="lg" type="submit" disabled={!validatePhone(phone)}>
              Login
            </Button>
          </Form>
        )}
        {otpGenerating && <p>Loading...</p>}
        {otpGenerated && (
          <Form onSubmit={submitOtp}>
            <Form.Group size="lg">
              <Form.Control
                autoFocus
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateOtp(otp)}>
              Submit
            </Button>
          </Form>
        )}
      </div>
    </div>
  )
}
