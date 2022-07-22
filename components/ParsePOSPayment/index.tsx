import React from "react"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"

import useSatPrice from "../../lib/use-sat-price"
import { ACTIONS, ACTIONTYPE } from "../../pages/merchant/_reducer"
import { formatOperand } from "../../utils/utils"
import DigitButton from "./DigitButton"
import styles from "./parsepayment.module.css"
import ReceiveInvoice from "./RecieveInvoice"

interface Props {
  defaultWalletCurrency?: string
  walletId?: string
  dispatch: React.Dispatch<ACTIONTYPE>
  state: React.ComponentState
}

function ParsePayment({ defaultWalletCurrency, walletId, dispatch, state }: Props) {
  const [usdDenomination, setUsdDenomination] = React.useState<boolean>(true)
  const { usdToSats } = useSatPrice()

  const valueInSats = `≈ ${formatOperand(
    usdToSats(Number(state.currentAmount)).toFixed().toString(),
  )} sats `
  const valueInUSD = `$ ${formatOperand(state.currentAmount)}`

  return (
    <Container className={styles.digits_container}>
      <div className={styles.output}>
        <div
          className={
            state.currentAmount?.length >= 10
              ? styles.curr_denomination_small
              : styles.curr_denomination
          }
        >
          {usdDenomination ? valueInUSD : valueInSats.slice(1, -1)}
        </div>
        <div className={styles.other_denomination}>
          {!usdDenomination ? valueInUSD : valueInSats}
        </div>
        <button onClick={() => setUsdDenomination(!usdDenomination)}>
          <Image
            src="/icons/convert-icon.svg"
            alt="convert to SAT/USD icon"
            width="24"
            height="24"
          />
        </button>
      </div>

      {state.createInvoice ? (
        <ReceiveInvoice
          dispatch={dispatch}
          state={state}
          recipientWalletCurrency={defaultWalletCurrency}
          walletId={walletId}
        />
      ) : (
        <div className={styles.digits_grid}>
          <DigitButton digit={"1"} dispatch={dispatch} />
          <DigitButton digit={"2"} dispatch={dispatch} />
          <DigitButton digit={"3"} dispatch={dispatch} />
          <DigitButton digit={"4"} dispatch={dispatch} />
          <DigitButton digit={"5"} dispatch={dispatch} />
          <DigitButton digit={"6"} dispatch={dispatch} />
          <DigitButton digit={"7"} dispatch={dispatch} />
          <DigitButton digit={"8"} dispatch={dispatch} />
          <DigitButton digit={"9"} dispatch={dispatch} />
          <DigitButton digit={"."} dispatch={dispatch} />
          <DigitButton digit={"0"} dispatch={dispatch} />
          <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
            <Image src="/icons/backspace-icon.svg" width="32" height="32" />
          </button>
        </div>
      )}

      <div className={styles.pay_btn_container}>
        <button
          className={state.createInvoice ? styles.pay_new_btn : styles.pay_btn}
          onClick={
            state.createInvoice
              ? () => dispatch({ type: ACTIONS.CREATE_NEW_INVOICE })
              : () => dispatch({ type: ACTIONS.CREATE_INVOICE })
          }
        >
          <Image
            src={
              state.createInvoice
                ? "/icons/lightning-icon-dark.svg"
                : "/icons/lightning-icon.svg"
            }
            width="20"
            height="20"
          />
          {state.createInvoice ? "Create new invoice" : "Create invoice"}
        </button>
        {!state.createInvoice && (
          <button
            className={styles.clear_btn}
            onClick={() => dispatch({ type: ACTIONS.CLEAR_INPUT })}
          >
            <Image src="/icons/clear-input-icon.svg" width="20" height="20" />
            Clear
          </button>
        )}
      </div>
    </Container>
  )
}

export default ParsePayment
