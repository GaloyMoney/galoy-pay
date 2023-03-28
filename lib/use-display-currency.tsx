import { gql } from "@apollo/client"
import * as React from "react"
import { Currency, CurrencyListQuery, useCurrencyListQuery } from "../graphql/generated"

gql`
  query currencyList {
    currencyList {
      id
      name
      flag
      fractionDigits
      symbol
      __typename
    }
  }
`

const useDisplayCurrency = () => {
  const [displayCurrencyList, setDisplayCurrencyList] = React.useState<CurrencyListQuery["currencyList"]>()
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = React.useState<Currency>({
    "id": "USD",
    "name": "US Dollar",
    "flag": "🇺🇸",
    "__typename": "Currency",
    "fractionDigits": 2,
    "symbol": "$"
  })
  const [displayCurrencyFormatted, setDisplayCurrencyFormatted] = React.useState<string>(
    `${selectedDisplayCurrency.symbol} 1.00`
  )

  useCurrencyListQuery({
    onCompleted(data) {
      console.log("get currenecy list completed")
      if (data.currencyList){
        setDisplayCurrencyList(data.currencyList)
      }
    },
  })

  React.useEffect(() => {
    console.log("handleSelectedCurrencyChange")
  }, [selectedDisplayCurrency])

  return {
    displayCurrencyList,
    selectedDisplayCurrency,
    setSelectedDisplayCurrency,
    displayCurrencyFormatted,
    setDisplayCurrencyFormatted,
  };
}
export default useDisplayCurrency
