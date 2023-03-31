import { gql, SubscriptionResult } from "@apollo/client"
import * as React from "react"
import { RealtimePriceWsSubscription, useRealtimePriceWsSubscription } from "../lib/graphql/generated"
import { useDisplayCurrency } from "../lib/use-display-currency"

gql`
  subscription realtimePriceWs($currency: DisplayCurrency!) {
    realtimePrice(input: { currency: $currency }) {
      errors {
        message
      }
      realtimePrice {
        timestamp
        btcSatPrice {
          base
          offset
        }
        usdCentPrice {
          base
          offset
        }
        denominatorCurrency
      }
    }
  }
`

const useRealtimePrice = (
  currency: string,
  onSubscriptionDataCallback?: (subscriptionData: SubscriptionResult<RealtimePriceWsSubscription, any>) => void
) => {
  const priceRef = React.useRef<number>(0)
  const { formatCurrency } = useDisplayCurrency()

  const { data } = useRealtimePriceWsSubscription({
    variables: { currency },
    onSubscriptionData({ subscriptionData }) {
      if (onSubscriptionDataCallback) onSubscriptionDataCallback(subscriptionData)
    },
  })

  const conversions = React.useMemo(
    () => ({
      satsToCurrency: (sats: number, display: string, fractionDigits: number) => {
        const convertedCurrencyAmount =
          fractionDigits === 2 ? (sats * priceRef.current) / 100 : sats * priceRef.current
        const formattedCurrency = formatCurrency({
          amountInMajorUnits: convertedCurrencyAmount,
          currency: display,
          withSign: true,
        })
        // if ((display === "USD" || display === "EUR") && convertedCurrencyAmount < 0.01) {
        //   formattedCurrency = "0"
        // }
        return {
          convertedCurrencyAmount,
          formattedCurrency,
        }
      },
      currencyToSats: (currency: number, display: string, fractionDigits: number) => {
        const convertedCurrencyAmount =
          fractionDigits === 2
            ? (100 * currency) / priceRef.current
            : currency / priceRef.current
        const formattedCurrency = formatCurrency({
          amountInMajorUnits: convertedCurrencyAmount,
          currency: display,
          withSign: true,
        })
        // if ((display === "USD" || display === "EUR") && convertedCurrencyAmount < 0.01) {
        //   formattedCurrency = "0"
        // }
        return {
          convertedCurrencyAmount,
          formattedCurrency,
        }
      },
    }),
    [priceRef, formatCurrency],
  )

  if (data?.realtimePrice?.realtimePrice?.btcSatPrice) {
    const { base, offset } = data.realtimePrice.realtimePrice.btcSatPrice
    priceRef.current = base / 10 ** offset
  }

  if (priceRef.current === 0) {
    return {
      satsToCurrency: () => {
        return {
          convertedCurrencyAmount: NaN,
          formattedCurrency: "0",
        }
      },
      currencyToSats: () => {
        return {
          convertedCurrencyAmount: NaN,
          formattedCurrency: "0",
        }
      },
    }
  }

  return conversions
}
export default useRealtimePrice
