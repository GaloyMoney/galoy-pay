import { gql } from "@apollo/client"
import * as React from "react"
import { useRealtimePriceWsSubscription } from "../lib/graphql/generated"

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

const useRealtimePrice = (currency: string) => {
  const priceRef = React.useRef<number>(0)

  const { data } = useRealtimePriceWsSubscription({
    variables: { currency },
  })

  const conversions = React.useMemo(
    () => ({
      satsToCurrency: (sats: number, fractionDigits: number) => {
        if (fractionDigits === 2) {
          return (sats * priceRef.current) / 100
        }
        return sats * priceRef.current
      },
    }),
    [priceRef],
  )

  if (data?.realtimePrice?.realtimePrice?.btcSatPrice) {
    const { base, offset } = data.realtimePrice.realtimePrice.btcSatPrice
    priceRef.current = base / 10 ** offset
  }

  if (priceRef.current === 0) {
    return {
      satsToCurrency: () => NaN,
    }
  }

  return conversions
}
export default useRealtimePrice
