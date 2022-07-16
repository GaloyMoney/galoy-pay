import { gql } from "@apollo/client"

export const RECIPIENT_WALLET_ID = gql`
  query accountDefaultWallet($username: Username!) {
    accountDefaultWallet(username: $username) {
      id
      walletCurrency
    }
  }
`
