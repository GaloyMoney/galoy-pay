import { gql } from "../__generated__"

export const ACCOUNT_DETAILS_BY_USERNAME = gql(/* GraphQL */ `
  query accountDetailsByUsername($username: Username!) {
    accountDetailsByUsername(username: $username) {
      id
      username
      level
      status
      title
      owner {
        id
        language
        phone
      }
      coordinates {
        latitude
        longitude
      }
      wallets {
        id
        walletCurrency
      }
      createdAt
    }
  }
`)
