import { gql } from "@apollo/client"

export const GET_ACCOUNT_BY_PHONE = gql`
  query getAccountDetailsByUserPhone($phone: Phone!) {
    accountDetails: accountDetailsByUserPhone(phone: $phone) {
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
`

export const GET_ACCOUNT_BY_USERNAME = gql`
  query getAccountDetailsByUsername($username: Username!) {
    accountDetails: accountDetailsByUsername(username: $username) {
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
`
export const ADD_USD_WALLET = gql`
  mutation accountsAddUsdWallet($input: AccountsAddUsdWalletInput!) {
    mutationData: accountsAddUsdWallet(input: $input) {
      errors {
        message
      }
      walletDetails {
        __typename
        id
      }
    }
  }
`

export const ACCOUNT_UPDATE_STATUS = gql`
  mutation accountUpdateStatus($input: AccountUpdateStatusInput!) {
    mutationData: accountUpdateStatus(input: $input) {
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
`

export const ACCOUNT_UPDATE_LEVEL = gql`
  mutation accountUpdateLevel($input: AccountUpdateLevelInput!) {
    mutationData: accountUpdateLevel(input: $input) {
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
`

export const BUSINESS_UPDATE_MAP_INFO = gql`
  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {
    mutationData: businessUpdateMapInfo(input: $input) {
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
`
