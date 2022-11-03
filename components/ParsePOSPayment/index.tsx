import { useRouter } from "next/router"
import React from "react"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"

import useSatPrice from "../../lib/use-sat-price"
import { ACTION_TYPE, ACTIONS } from "../../pages/_reducer"
import { formatOperand } from "../../utils/utils"
import DigitButton from "./Digit-Button"
import styles from "./parse-payment.module.css"
import ReceiveInvoice from "./Receive-Invoice"

interface Props {
  defaultWalletCurrency?: string
  walletId?: string
  dispatch: React.Dispatch<ACTION_TYPE>
  state: React.ComponentState
}

export enum AmountUnit {
  Sat = "SAT",
  Cent = "CENT",
}

function ParsePayment({ defaultWalletCurrency, walletId, dispatch, state }: Props) {
  const [usdDenomination, setUsdDenomination] = React.useState<boolean>(true)
  const { usdToSats, satsToUsd } = useSatPrice()
  const router = useRouter()
  const { username, amount, sats, unit } = router.query

  const value = usdToSats(Number(state.currentAmount)).toFixed()
  const valueInUSD = `$ ${
    unit === AmountUnit.Sat
      ? satsToUsd(Number(sats)).toFixed(2)
      : formatOperand(state.currentAmount)
  }`
  const valueInSats = `≈ ${
    unit === AmountUnit.Sat
      ? formatOperand(state.currentAmount)
      : formatOperand(value.toString())
  } sats `

  const updatedValue = React.useMemo(() => {
    if (unit === AmountUnit.Cent) {
      return usdToSats(Number(state.currentAmount)).toFixed(2)
    } else {
      if (state.currentAmount === sats) {
        return satsToUsd(Number(sats)).toFixed(2)
      }
      return satsToUsd(Number(state.currentAmount)).toFixed(2)
    }
  }, [state.currentAmount, unit, usdToSats, sats, satsToUsd])

  const toggleCurrency = () => {
    const newUnit = unit === AmountUnit.Sat ? AmountUnit.Cent : AmountUnit.Sat
    if (!unit || unit != newUnit) {
      router.push(
        {
          pathname: `${username}`,
          query: {
            amount:
              unit === AmountUnit.Sat
                ? Math.round(satsToUsd(state.currentAmount))
                : state.currentAmount,
            sats: value || 0,
            currency: defaultWalletCurrency,
            unit: newUnit,
          },
        },
        undefined,
        { shallow: true },
      )
    }
  }

  React.useEffect(() => {
    if (!unit) return
    router.push(
      {
        pathname: `${username}`,
        query: {
          amount: unit === AmountUnit.Sat ? updatedValue : state.currentAmount,
          sats: unit === AmountUnit.Sat ? state.currentAmount : updatedValue || 0,
          currency: defaultWalletCurrency,
          unit,
        },
      },
      undefined,
      { shallow: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedValue])

  React.useEffect(() => {
    if (Number(amount) > 0) {
      dispatch({
        type: ACTIONS.SET_AMOUNT_FROM_PARAMS,
        payload: amount?.toString(),
      })
    }
    if (unit === AmountUnit.Sat) {
      dispatch({
        type: ACTIONS.SET_AMOUNT_FROM_PARAMS,
        payload: sats?.toString(),
      })
    }
  }, [amount, unit, sats, dispatch])

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
        <button
          onClick={() => {
            toggleCurrency()
            setUsdDenomination(!usdDenomination)
          }}
        >
          <Image
            src="/icons/convert-icon.svg"
            alt="convert to SAT/USD icon"
            width="24"
            height="24"
          />
        </button>
      </div>

      {state.createdInvoice ? (
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
            <Image
              src="/icons/backspace-icon.svg"
              alt="delete digit icon"
              width="32"
              height="32"
            />
          </button>
        </div>
      )}

      <div className={styles.pay_btn_container}>
        <button
          className={state.createdInvoice ? styles.pay_new_btn : styles.pay_btn}
          onClick={
            state.createdInvoice
              ? () =>
                  dispatch({
                    type: ACTIONS.CREATE_NEW_INVOICE,
                    payload: () => toggleCurrency(),
                  })
              : () =>
                  dispatch({ type: ACTIONS.CREATE_INVOICE, payload: amount?.toString() })
          }
        >
          <Image
            src={
              state.createdInvoice
                ? "/icons/lightning-icon-dark.svg"
                : "/icons/lightning-icon.svg"
            }
            alt="lightning icon"
            width="20"
            height="20"
          />
          {state.createdInvoice ? "Create new invoice" : "Create invoice"}
        </button>
        {!state.createdInvoice && (
          <button
            className={styles.clear_btn}
            onClick={() => dispatch({ type: ACTIONS.CLEAR_INPUT })}
          >
            <Image
              src="/icons/clear-input-icon.svg"
              alt="clear input icon"
              width="20"
              height="20"
            />
            Clear
          </button>
        )}
      </div>
    </Container>
  )
}

export default ParsePayment
