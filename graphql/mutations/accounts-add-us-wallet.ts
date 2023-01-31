import { gql } from "../__generated__"

export const ACCOUNTS_ADD_USD_WALLET = gql(/* GraphQL */ `
  mutation accountsAddUsdWallet($input: AccountsAddUsdWalletInput!) {
    accountsAddUsdWallet(input: $input) {
      errors {
        message
      }
      walletDetails {
        __typename
        id
      }
    }
  }
`)
