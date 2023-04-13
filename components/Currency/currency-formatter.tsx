import React from "react"

interface CurrencyFormatterProps {
  symbol: string
  amount: number | string
  currencyCode: string
  fractionDigits: number
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  symbol,
  amount = 0,
  currencyCode,
  fractionDigits,
}) => {
  const locale = navigator.language

  console.log("locale", locale)

  const formattedValue = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number(amount))

  console.log("formattedValue", formattedValue)
  console.log("amount", amount)

  if (fractionDigits === 0) {
    return (
      <span>
        {symbol}
        {formattedValue}
      </span>
    )
  }

  const amountWithLocaleComma = Number(amount).toLocaleString(locale)
  console.log("amountWithComma", amountWithLocaleComma)
  const blackPart = amountWithLocaleComma
  const grayPart = formattedValue.substring(amountWithLocaleComma.toString().length)

  return (
    <span>
      {symbol}
      <span style={{ color: "black" }}>{blackPart}</span>
      <span style={{ color: "grey" }}>{grayPart}</span>
    </span>
  )
}

export default CurrencyFormatter
