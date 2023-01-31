import { gql } from "../__generated__"

export const LOGIN = gql(/* GraphQL */ `
  mutation login($input: UserLoginInput!) {
    userLogin(input: $input) {
      errors {
        message
      }
      authToken
    }
  }
`)
