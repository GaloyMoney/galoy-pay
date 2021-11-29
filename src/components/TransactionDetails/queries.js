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

export const GET_TRANSACTIONS_BY_HASH = gql`
  query TransactionsByHash($hash: PaymentHash!) {
    transactions: transactionsByHash(hash: $hash) {
      id
      initiationVia {
        __typename
        ... on InitiationViaIntraLedger {
          counterPartyWalletId
          counterPartyUsername
        }
        ... on InitiationViaLn {
          paymentHash
        }
        ... on InitiationViaOnChain {
          address
        }
      }
      settlementVia {
        __typename
        ... on SettlementViaIntraLedger {
          counterPartyWalletId
          counterPartyUsername
        }
        ... on SettlementViaLn {
          paymentSecret
        }
        ... on SettlementViaOnChain {
          transactionHash
        }
      }
      settlementAmount
      settlementFee
      settlementPrice {
        base
        offset
        currencyUnit
        formattedAmount
      }
      direction
      status
      memo
      createdAt
    }
  }
`

export const GET_TRANSACTION_BY_ID = gql`
  query TransactionById($id: ID!) {
    transaction: transactionById(id: $id) {
      id
      initiationVia {
        __typename
        ... on InitiationViaIntraLedger {
          counterPartyWalletId
          counterPartyUsername
        }
        ... on InitiationViaLn {
          paymentHash
        }
        ... on InitiationViaOnChain {
          address
        }
      }
      settlementVia {
        __typename
        ... on SettlementViaIntraLedger {
          counterPartyWalletId
          counterPartyUsername
        }
        ... on SettlementViaLn {
          paymentSecret
        }
        ... on SettlementViaOnChain {
          transactionHash
        }
      }
      settlementAmount
      settlementFee
      settlementPrice {
        base
        offset
        currencyUnit
        formattedAmount
      }
      direction
      status
      memo
      createdAt
    }
  }
`
