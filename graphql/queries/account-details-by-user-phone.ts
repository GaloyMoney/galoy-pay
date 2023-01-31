import { gql } from "../__generated__"

export const ACCOUNT_DETAILS_BY_USER_PHONE = gql(/* GraphQL */ `
  query accountDetailsByUserPhone($phone: Phone!) {
    accountDetailsByUserPhone(phone: $phone) {
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
