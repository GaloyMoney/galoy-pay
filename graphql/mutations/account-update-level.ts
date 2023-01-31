import { gql } from "../__generated__"

export const ACCOUNT_UPDATE_LEVEL = gql(/* GraphQL */ `
  mutation accountUpdateLevel($input: AccountUpdateLevelInput!) {
    accountUpdateLevel(input: $input) {
      errors {
        message
      }
      accountDetails {
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
        createdAt
      }
    }
  }
`)
