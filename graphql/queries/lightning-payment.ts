import { gql } from "../__generated__"

export const LIGHTNING_PAYMENT = gql(/* GraphQL */ `
  query lightningPayment($hash: PaymentHash!) {
    lightningPayment(hash: $hash) {
      createdAt
      confirmedAt
      status
      amount
      roundedUpFee
      revealedPreImage
      request
      destination
    }
  }
`)
