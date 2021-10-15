import { gql } from "@apollo/client"

export const GET_LNPAYMENT_BY_HASH = gql`
  query LightningPaymentQuery($hash: PaymentHash!) {
    payment: lightningPayment(hash: $hash) {
      createdAt
      confirmedAt
      status
      amount
      roundedUpFee
      secret
      request
      destination
    }
  }
`

export const GET_LNINVOICE_BY_HASH = gql`
  query LightningInvoiceQuery($hash: PaymentHash!) {
    invoice: lightningInvoice(hash: $hash) {
      createdAt
      confirmedAt
      description
      expiresAt
      isSettled
      received
      request
      secret
    }
  }
`
