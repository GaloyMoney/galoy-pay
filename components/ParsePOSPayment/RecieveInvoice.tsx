import React from "react"
import Image from "react-bootstrap/Image"
import { QRCode } from "react-qrcode-logo"

import useCreateInvoice from "../../hooks/useCreateInvoice"
import useSatPrice from "../../lib/use-sat-price"
import { formatOperand } from "../../utils/utils"
import styles from "./parsepayment.module.css"

interface Props {
  minutes: number
  seconds: number
  recipientWalletCurrency?: string
  walletId: string | undefined
  state: React.ComponentState
}

function ReceiveInvoice({
  minutes,
  seconds,
  state,
  recipientWalletCurrency,
  walletId,
}: Props) {
  const { createInvoice, data, error, loading } = useCreateInvoice({
    recipientWalletCurrency,
  })
  const { usdToSats } = useSatPrice()

  const amount =
    state.walletCurrency === "USD"
      ? state.currentAmount
      : formatOperand(usdToSats(Number(state.currentAmount)).toFixed().toString())

  const generateInvoice = React.useCallback(() => {
    createInvoice({
      variables: { walletId: walletId, amount: amount },
    })
  }, [amount, walletId, createInvoice])

  React.useEffect(() => {
    generateInvoice()
  }, [generateInvoice])

  let errorString: string | null = error?.message || null
  let invoice

  if (data) {
    const invoiceData = data.mutationData
    if (invoiceData.errors?.length > 0) {
      errorString = invoiceData.errors.map((e) => e.message).join(", ")
    } else {
      invoice = invoiceData.invoice
    }
  }

  const loadingOrErrorMsg = loading ? (
    <p className={styles.loading}>Generating invoice</p>
  ) : error || data?.mutationData.errors.length ? (
    <p className={styles.error}>{errorString}</p>
  ) : null

  return (
    <div className={styles.invoice_container}>
      {recipientWalletCurrency === "USD" && (
        <div className={styles.timer_container}>
          <p>{`${minutes}:${seconds}`}</p>
          <div className={styles.timer}>
            <span></span>
          </div>
          <p>5:00</p>
        </div>
      )}
      <div className={styles.qr_code_container}>
        {loading ? (
          loadingOrErrorMsg
        ) : (
          <>
            <div
              className={styles.qr_code}
              aria-labelledby="QR code of lightning payment"
            >
              <QRCode
                value={invoice?.paymentRequest}
                size={320}
                logoImage="/BBW-QRLOGO.png"
                logoWidth={100}
              />
            </div>
            <div className={styles.qr_clipboard}>
              <button>
                <Image
                  src="/icons/copy-icon.svg"
                  alt="copy icon"
                  width="18px"
                  height="18px"
                />
                Copy
              </button>
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
    </div>
  )
}

export default ReceiveInvoice
