import { gql } from "../__generated__"

export const TRANSACTIONS_BY_HASH = gql(/* GraphQL */ `
  query transactionsByHash($hash: PaymentHash!) {
    transactionsByHash(hash: $hash) {
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
`)
