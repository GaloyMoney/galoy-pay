import React from "react"

import { ACTIONS, ACTIONTYPE } from "../../pages/merchant/_reducer"

interface Props {
  digit: string
  dispatch: React.Dispatch<ACTIONTYPE>
}

function DigitButton({ digit, dispatch }: Props) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: digit })}>
      {digit}
    </button>
  )
}

export default DigitButton
