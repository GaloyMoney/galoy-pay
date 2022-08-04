import copy from "copy-to-clipboard"
import { useRouter } from "next/router"
import React from "react"
import Image from "react-bootstrap/Image"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import { QRCode } from "react-qrcode-logo"
import { useTimer } from "react-timer-hook"

import useCreateInvoice from "../../hooks/use-Create-Invoice"
import { LnInvoiceObject } from "../../lib/graphql/index.types.d"
import useSatPrice from "../../lib/use-sat-price"
import { ACTION_TYPE } from "../../pages/merchant/_reducer"
import { formatOperand } from "../../utils/utils"
import PaymentOutcome from "../PaymentOutcome"
import styles from "./parse-payment.module.css"

interface Props {
  recipientWalletCurrency?: string
  walletId: string | undefined
  state: React.ComponentState
  dispatch: React.Dispatch<ACTION_TYPE>
}

function ReceiveInvoice({ recipientWalletCurrency, walletId, dispatch }: Props) {
  const { usdToSats } = useSatPrice()
  const { amount, currency } = useRouter().query
  const [copied, setCopied] = React.useState<boolean>(false)
  const timerRef = React.useRef<Date>()

  timerRef.current = new Date()
  if (currency === "USD") {
    timerRef.current.setSeconds(timerRef.current.getSeconds() + 60 * 5) // default to five mins for USD invoice
  }
  const expiryTimestamp = timerRef.current
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called on USD"),
  })

  const { createInvoice, data, error, loading } = useCreateInvoice({
    recipientWalletCurrency,
  })
  const paymentAmount = React.useMemo(() => {
    if (currency === "USD") {
      return amount
    }
    return formatOperand(usdToSats(Number(amount)).toFixed().toString())
  }, [amount, currency, usdToSats])

  React.useEffect(() => {
    createInvoice({
      variables: { walletId: walletId, amount: paymentAmount },
    })
  }, [paymentAmount, walletId, createInvoice])

  let errorString: string | null = error?.message || null
  let invoice: LnInvoiceObject | undefined

  if (data) {
    const invoiceData = data.mutationData
    if (invoiceData.errors?.length > 0) {
      errorString = invoiceData.errors.map((e) => e.message).join(", ")
    } else {
      invoice = invoiceData.invoice
    }
  }

  const copyInvoice = () => {
    if (!invoice?.paymentRequest) {
      return
    }
    copy(invoice.paymentRequest)
    setCopied(!copied)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <div className={styles.invoice_container}>
      {recipientWalletCurrency === "USD" && (
        <div className={styles.timer_container}>
          <p>{`${currency === "USD" && minutes}:${currency === "USD" && seconds}`}</p>
          <div className={styles.timer}>
            <span></span>
          </div>
          <p>5:00</p>
        </div>
      )}
      <div className={styles.qr_code_container}>
        {loading || invoice?.paymentRequest === undefined ? (
          <p className={styles.loading}>Generating invoice</p>
        ) : error ? (
          <p className={styles.error}>{errorString}</p>
        ) : (
          <>
            <div
              className={styles.qr_code}
              aria-labelledby="QR code of lightning payment"
              onClick={copyInvoice}
            >
              <QRCode
                value={invoice?.paymentRequest}
                size={320}
                logoImage="/BBW-QRLOGO.png"
                logoWidth={100}
              />
            </div>
            <div className={styles.qr_clipboard}>
              <OverlayTrigger
                show={copied}
                placement="right"
                overlay={<Tooltip id="copy">Copied!</Tooltip>}
              >
                <button onClick={copyInvoice}>
                  <Image
                    src="/icons/copy-icon.svg"
                    alt="copy icon"
                    width="18px"
                    height="18px"
                  />
                  {copied ? "Copied" : "Copy"}
                </button>
              </OverlayTrigger>
              <button>
                <Image
                  src="/icons/share-icon.svg"
                  alt="share-icon"
                  width="18px"
                  height="18px"
                />
                Share
              </button>
            </div>
          </>
        )}
      </div>
      <PaymentOutcome
        paymentRequest={invoice?.paymentRequest}
        paymentAmount={paymentAmount}
        dispatch={dispatch}
      />
    </div>
  )
}

export default ReceiveInvoice
