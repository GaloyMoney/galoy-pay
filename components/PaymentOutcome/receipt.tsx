import React from "react"
import Image from "react-bootstrap/Image"
import GaloyIcon from "./Galoy"
import styles from "./payment-outcome.module.css"
import { formatOperand } from "../../utils/utils"

interface Props {
  amount: string | string[] | undefined
  sats: string | string[] | undefined
  username: string | string[] | undefined
  paymentRequest:string
  memo:string | string[] | undefined
}

function receipt(props: Props) {
  const date = new Date()
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const transactionDate =
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
  const transactionTime =
    date.getHours() + ":" + date.getMinutes() + " " + (date.getHours() > 12 ? "pm" : "am")

  return (
    <div className="w-100">
      <div className="d-flex justify-content-center">
        <Image src="/QRLOGO-BBW.png" />
      </div>

      <div className="text-center">
        <span>Transaction Amount</span>
        <h1>{props.sats} sats</h1>
        <span> ${props.amount?formatOperand(
                    props.amount?.toString(),
                  ):"~ less than a 1 cent"} </span>
       
        <div className="d-flex justify-content-center">
        <table className="my-3 w-100">
          <tr>
            <td className="py-3 border-bottom">Beneficiary Name</td>
            <td className="py-3 border-bottom">{props.username}</td>
          </tr>
          <tr>
            <td className="py-3 border-bottom">Paid On</td>
            <td className="py-3 border-bottom">
              {transactionDate} at <span>{transactionTime}</span>
            </td>
          </tr>
        
          <tr>
            <td className="py-5 border-bottom">Transaction Reference <br/> (Invoice)</td>
            <td className="py-5 border-bottom"><div className={styles.reference}>{props.paymentRequest}</div></td>
          </tr>

          <tr>
            <td className="py-3 border-bottom">Status</td>
            <td className="py-3 border-bottom">Paid</td>
          </tr>
         
          <tr>
            <td className="py-3 border-bottom">Description</td>
            <td className="py-3 border-bottom">{props.memo?props.memo:"none"}</td>
          </tr>

        </table>
        </div>
        <a className={styles.link} href="https://galoy.io" target="_blank" rel="noreferrer"> Powered by <GaloyIcon /></a>
      </div>
    </div>
  )
}

export default receipt
