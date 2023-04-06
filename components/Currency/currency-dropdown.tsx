import React, { useEffect } from "react"
import { useCurrencyListQuery } from "../../lib/graphql/generated"
import { useRouter } from "next/router"

export default function CurrencyDropdown({
  onSelectedDisplayCurrencyChange,
  name,
  style,
}: {
  onSelectedDisplayCurrencyChange?: (newDisplayCurrency: string) => void
  name?: string
  style?: React.CSSProperties
}) {
  const router = useRouter()
  const { data: currencyData } = useCurrencyListQuery()
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = React.useState("USD")

  useEffect(() => {
    if (router.query?.display && typeof router.query.display === "string") {
      setSelectedDisplayCurrency(router.query.display)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <select
      style={style ?? { border: "none" }}
      name={name ?? "display"}
      placeholder={selectedDisplayCurrency}
      required
      value={selectedDisplayCurrency}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        const currencyId = event.target.value
        const newDisplayCurrency = currencyData?.currencyList?.find(
          (item) => item.id === currencyId,
        )
        if (newDisplayCurrency) {
          setSelectedDisplayCurrency(newDisplayCurrency.id)
        }
        if (onSelectedDisplayCurrencyChange)
          onSelectedDisplayCurrencyChange(newDisplayCurrency?.id ?? "USD")
      }}
    >
      {currencyData?.currencyList?.map((option) => (
        <option key={option.id} value={option.id}>
          {option.id}
        </option>
      ))}
    </select>
  )
}
