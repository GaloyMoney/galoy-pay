import { gql } from "@apollo/client"

export const LN_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT = gql`
  mutation lnInvoiceCreateOnBehalfOfRecipient($walletId: WalletId!, $amount: SatAmount!) {
    mutationData: lnInvoiceCreateOnBehalfOfRecipient(
      input: { recipientWalletId: $walletId, amount: $amount }
    ) {
      errors {
        message
      }
      invoice {
        paymentRequest
      }
    }
  }
`

export const LN_USD_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT = gql`
  mutation lnUsdInvoiceCreateOnBehalfOfRecipient(
    $walletId: WalletId!
    $amount: CentAmount!
  ) {
    mutationData: lnUsdInvoiceCreateOnBehalfOfRecipient(
      input: { recipientWalletId: $walletId, amount: $amount }
    ) {
      errors {
        message
      }
      invoice {
        paymentRequest
      }
    }
  }
`
