import { gql } from "../__generated__"

export const LIGHTNING_INVOICE = gql(/* GraphQL */ `
  query lightningInvoice($hash: PaymentHash!) {
    lightningInvoice(hash: $hash) {
      createdAt
      confirmedAt
      description
      expiresAt
      isSettled
      received
      request
      secretPreImage
    }
  }
`)
