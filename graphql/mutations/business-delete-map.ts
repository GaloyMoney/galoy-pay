import { gql } from "../__generated__"

export const BUSINESS_DELETE_MAP = gql(/* GraphQL */ `
  mutation businessDeleteMapInfo($input: BusinessDeleteMapInfoInput!) {
    businessDeleteMapInfo(input: $input) {
      errors {
        message
      }
      accountDetails {
        id
        owner {
          id
          language
          phone
        }
        username
        level
        status
        title
        coordinates {
          latitude
          longitude
        }
        createdAt
      }
    }
  }
`)
