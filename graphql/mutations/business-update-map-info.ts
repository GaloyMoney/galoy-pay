import { gql } from "../__generated__"

export const BUSINESS_UPDATE_MAP_INFO = gql(/* GraphQL */ `
  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {
    businessUpdateMapInfo(input: $input) {
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
