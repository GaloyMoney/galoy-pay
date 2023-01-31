import { gql } from "../__generated__"

export const ACCOUNT_UPDATE_STATUS = gql(/* GraphQL */ `
  mutation accountUpdateStatus($input: AccountUpdateStatusInput!) {
    accountUpdateStatus(input: $input) {
      errors {
        message
      }
      accountDetails {
        __typename
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
