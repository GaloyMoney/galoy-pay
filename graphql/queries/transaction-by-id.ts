import { gql } from "../__generated__"

export const TRANSACTION_BY_ID = gql(/* GraphQL */ `
  query transactionById($id: ID!) {
    transactionById(id: $id) {
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
