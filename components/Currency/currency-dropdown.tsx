import React, { useEffect } from "react"
import { useCurrencyListQuery } from "../../lib/graphql/generated"
import { useRouter } from "next/router"

export default function CurrencyDropdown({
  onSelectedDisplayCurrencyChange,
  name,
  style,
  showOnlyFlag = false,
}: {
  onSelectedDisplayCurrencyChange?: (newDisplayCurrency: string) => void
  name?: string
  style?: React.CSSProperties
  showOnlyFlag?: boolean
}) {
  const router = useRouter()
  const { data: currencyData } = useCurrencyListQuery()
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = React.useState(
    router.query.display && typeof router.query.display === "string"
      ? router.query.display
      : "USD",
  )

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
      {currencyData?.currencyList?.map((option) => {
        const isSelected = selectedDisplayCurrency === option.id
        const displayValue = showOnlyFlag
          ? option.flag
          : `${option.id} - ${option.name} ${option.flag ? option.flag : ""}`
        return (
          <option key={option.id} value={option.id}>
            {isSelected
              ? displayValue
              : `${option.id} - ${option.name} ${option.flag ? option.flag : ""}`}
          </option>
        )
      })}
    </select>
  )
}
