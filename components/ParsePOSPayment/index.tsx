import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import useRealtimePrice from "../../lib/use-realtime-price"
import { ACTION_TYPE, ACTIONS } from "../../pages/_reducer"
import { parseDisplayCurrency } from "../../utils/utils"
import Memo from "../Memo"
import DigitButton from "./Digit-Button"
import styles from "./parse-payment.module.css"
import ReceiveInvoice from "./Receive-Invoice"
import { useDisplayCurrency } from "../../lib/use-display-currency"
import { Currency } from "../../lib/graphql/generated"

function isRunningStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches
}

interface Props {
  defaultWalletCurrency?: string
  walletId?: string
  dispatch: React.Dispatch<ACTION_TYPE>
  state: React.ComponentState
}

interface UpdateAmount {
  shouldUpdate: boolean
  value: string | null
}

export enum AmountUnit {
  Sat = "SAT",
  Cent = "CENT",
}

function ParsePayment({ defaultWalletCurrency, walletId, dispatch, state }: Props) {
  const router = useRouter()
  const { display } = parseDisplayCurrency(router.query)
  const { currencyToSats, satsToCurrency } = useRealtimePrice(display)
  const { formatCurrency, currencyList } = useDisplayCurrency()
  const [valueInFiat, setValueInFiat] = React.useState("0.00")
  const [valueInSats, setValueInSats] = React.useState(0)
  const [currencyMetadata, setCurrencyMetadata] = React.useState<Currency>({
    id: "USD",
    flag: "🇺🇸",
    name: "US Dollar",
    symbol: "$",
    fractionDigits: 2,
    __typename: "Currency",
  })
  const { username, amount, sats, unit, memo } = router.query
  const prevUnit = React.useRef(AmountUnit.Cent)

  // load up all query params on first load, even if they are not passed
  useEffect(() => {
    console.log("initialAmount", amount)
    const initialAmount = safeAmount(amount)
    const initialSats = safeAmount(sats)
    router.push(
      {
        pathname: `${username}`,
        query: {
          amount: initialAmount,
          sats: initialSats,
          unit: unit ?? "SAT",
          memo: memo ?? "",
          display: display ?? "USD",
        },
      },
      undefined,
      { shallow: true },
    )
  }, [])

  const updateCurrentAmountWithParams = React.useCallback((): UpdateAmount => {
    if (unit === AmountUnit.Sat) {
      if (sats === state.currentAmount) {
        return {
          shouldUpdate: false,
          value: null,
        }
      } else if (sats) {
        return {
          shouldUpdate: true,
          value: sats.toString(),
        }
      }
    } else {
      if (Number(amount) === Number(state.currentAmount)) {
        return { shouldUpdate: false, value: null }
      } else if (amount) {
        return { shouldUpdate: true, value: amount.toString() }
      }
    }
    return { shouldUpdate: false, value: null }
  }, [amount, sats, unit, state.currentAmount])

  const toggleCurrency = () => {
    const newUnit = unit === AmountUnit.Sat ? AmountUnit.Cent : AmountUnit.Sat
    prevUnit.current = (unit as AmountUnit) || AmountUnit.Cent
    router.push(
      {
        pathname: `${username}`,
        query: {
          currency: defaultWalletCurrency,
          unit: newUnit,
          memo,
          display,
        },
      },
      undefined,
      { shallow: true },
    )
  }

  // Update Params From Current Amount
  React.useEffect(() => {
    if (!unit) return

    const { convertedCurrencyAmount } = satsToCurrency(
      state.currentAmount,
      display,
      currencyMetadata.fractionDigits,
    )
    let amount = unit === AmountUnit.Sat ? convertedCurrencyAmount : state.currentAmount
    amount = safeAmount(amount)
    amount =
      currencyMetadata.fractionDigits === 0
        ? amount.toFixed()
        : amount.toFixed(currencyMetadata.fractionDigits)
    setValueInFiat(amount)
    console.log("amountConversion", amount)

    let sats =
      unit === AmountUnit.Sat
        ? state.currentAmount
        : currencyToSats(
            Number(state.currentAmount),
            display,
            currencyMetadata.fractionDigits,
          ).convertedCurrencyAmount
    sats = safeAmount(sats).toFixed()
    setValueInSats(sats)
    console.log("satsConversion", sats)

    router.push(
      {
        pathname: `${username}`,
        query: {
          amount,
          sats,
          currency: defaultWalletCurrency,
          unit,
          memo,
          display,
        },
      },
      undefined,
      { shallow: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentAmount])

  // Toggle Current Amount
  React.useEffect(() => {
    if (!unit || unit === prevUnit.current) return
    if (unit === AmountUnit.Cent) {
      const { convertedCurrencyAmount } = currencyToSats(
        Number(amount),
        display,
        currencyMetadata.fractionDigits,
      )
      dispatch({
        type: ACTIONS.SET_AMOUNT_FROM_PARAMS,
        payload: convertedCurrencyAmount.toString(),
      })
    }
    if (unit === AmountUnit.Sat) {
      const { convertedCurrencyAmount } = satsToCurrency(
        Number(sats),
        display,
        currencyMetadata.fractionDigits,
      )
      dispatch({
        type: ACTIONS.SET_AMOUNT_FROM_PARAMS,
        payload: convertedCurrencyAmount?.toString(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  // Update CurrencyMetadata
  React.useEffect(() => {
    const latestCurrencyMetadata = currencyList?.find((c) => c.id === display)
    if (latestCurrencyMetadata) {
      setCurrencyMetadata(latestCurrencyMetadata)
      console.log("update latestCurrencyMetadata", latestCurrencyMetadata)
    }
  }, [display, currencyList])

  // Update Current Amount From Params
  React.useEffect(() => {
    console.log("dispatch changed locally", amount, sats, unit)
    if (!unit || !sats || !amount) return
    const { shouldUpdate, value } = updateCurrentAmountWithParams()
    if (shouldUpdate && value) {
      dispatch({
        type: ACTIONS.SET_AMOUNT_FROM_PARAMS,
        payload: value?.toString(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, sats, unit, dispatch])

  return (
    <Container className={styles.digits_container}>
      <div className={styles.output}>
        {!state.createdInvoice && !isRunningStandalone() && (
          <button
            onClick={() => {
              dispatch({
                type: ACTIONS.PINNED_TO_HOMESCREEN_MODAL_VISIBLE,
                payload: !state.pinnedToHomeScreenModalVisible,
              })
            }}
            className={styles.pin_btn}
          >
            <Image src="/icons/pin-icon.svg" alt="pin icon" className={styles.pin_icon} />
          </button>
        )}
        <div
          className={`${
            !unit || unit === AmountUnit.Cent ? styles.zero_order : styles.first_order
          }`}
        >
          {currencyMetadata.symbol}
          {valueInFiat} {currencyMetadata.flag}
        </div>
        <div
          className={`${unit === AmountUnit.Sat ? styles.zero_order : styles.first_order}
          }`}
        >
          {valueInSats} sats
        </div>
        {state.createdInvoice ? null : (
          <button title="toggle currency" onClick={() => toggleCurrency()}>
            <Image
              src="/icons/convert-icon.svg"
              alt="convert to SAT/USD icon"
              width="24"
              height="24"
            />
          </button>
        )}
      </div>

      <Memo createdInvoice={state.createdInvoice} />

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
          <DigitButton
            digit={"."}
            dispatch={dispatch}
            disabled={unit === AmountUnit.Sat}
          />
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
          onClick={() => {
            if (state.createdInvoice) {
              dispatch({ type: ACTIONS.CREATE_NEW_INVOICE })
            } else {
              dispatch({ type: ACTIONS.CREATE_INVOICE, payload: amount?.toString() })
            }
          }}
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

function safeAmount(amount: any, hasLeadingZeros?: boolean) {
  try {
    if (isNaN(amount)) return 0
    const theSafeAmount = (
      amount !== "NaN" &&
      amount !== undefined &&
      amount !== "" &&
      typeof amount === "string"
        ? !amount?.includes("NaN")
        : true
    )
      ? amount
      : 0
    console.log("safeAmount", Number(theSafeAmount))
    return Number(theSafeAmount)
  } catch (e) {
    console.log("safeAmountError", e)
    return 0
  }
}

export default ParsePayment
