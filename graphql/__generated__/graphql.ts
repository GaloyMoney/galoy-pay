/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** An Opaque Bearer token */
  AuthToken: any
  Language: any
  LnPaymentPreImage: any
  /** BOLT11 lightning invoice payment request with the amount included */
  LnPaymentRequest: any
  LnPaymentSecret: any
  LnPubkey: any
  /** Text field in a lightning payment transaction */
  Memo: any
  /** An address for an on-chain bitcoin destination */
  OnChainAddress: any
  OnChainTxHash: any
  /** An authentication code valid for a single use */
  OneTimeAuthCode: any
  PaymentHash: any
  /** Phone number which includes country code */
  Phone: any
  /** Non-fractional signed whole numeric value between -(2^53) + 1 and 2^53 - 1 */
  SafeInt: any
  /** (Positive) Satoshi amount */
  SatAmount: any
  /** An amount (of a currency) that can be negative (e.g. in a transaction) */
  SignedAmount: any
  /** (Positive) Number of blocks in which the transaction is expected to be confirmed */
  TargetConfirmations: any
  /** Timestamp field, serialized as Unix time (the number of seconds since the Unix epoch) */
  Timestamp: any
  /** Unique identifier of a user */
  Username: any
  /** Unique identifier of a wallet */
  WalletId: any
}

/** Accounts are core to the Galoy architecture. they have users, and own wallets */
export type Account = {
  __typename?: "Account"
  /** GPS coordinates for the account that can be used to place the related business on a map */
  coordinates?: Maybe<Coordinates>
  createdAt: Scalars["Timestamp"]
  id: Scalars["ID"]
  level: AccountLevel
  owner: User
  status: AccountStatus
  title?: Maybe<Scalars["String"]>
  username?: Maybe<Scalars["Username"]>
  wallets: Array<Wallet>
}

export type AccountDetailPayload = {
  __typename?: "AccountDetailPayload"
  accountDetails?: Maybe<Account>
  errors: Array<Error>
}

export enum AccountLevel {
  One = "ONE",
  Two = "TWO",
}

export enum AccountStatus {
  Active = "ACTIVE",
  Locked = "LOCKED",
  New = "NEW",
  Pending = "PENDING",
}

export type AccountUpdateLevelInput = {
  level: AccountLevel
  uid: Scalars["ID"]
}

export type AccountUpdateStatusInput = {
  comment?: InputMaybe<Scalars["String"]>
  status: AccountStatus
  uid: Scalars["ID"]
}

export type AccountsAddUsdWalletInput = {
  accountIds: Array<Scalars["ID"]>
}

export type AuthTokenPayload = {
  __typename?: "AuthTokenPayload"
  authToken?: Maybe<Scalars["AuthToken"]>
  errors: Array<Error>
}

/** A wallet belonging to an account which contains a BTC balance and a list of transactions. */
export type BtcWallet = Wallet & {
  __typename?: "BTCWallet"
  accountId: Scalars["ID"]
  /** A balance stored in BTC. */
  balance: Scalars["SignedAmount"]
  id: Scalars["ID"]
  /** An unconfirmed incoming onchain balance. */
  pendingIncomingBalance: Scalars["SignedAmount"]
  /** A list of BTC transactions associated with this wallet. */
  transactions?: Maybe<TransactionConnection>
  transactionsByAddress?: Maybe<TransactionConnection>
  walletCurrency: WalletCurrency
}

/** A wallet belonging to an account which contains a BTC balance and a list of transactions. */
export type BtcWalletTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

/** A wallet belonging to an account which contains a BTC balance and a list of transactions. */
export type BtcWalletTransactionsByAddressArgs = {
  address: Scalars["OnChainAddress"]
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

export type BusinessUpdateMapInfoInput = {
  latitude: Scalars["Float"]
  longitude: Scalars["Float"]
  title: Scalars["String"]
  username: Scalars["Username"]
}

export type CaptchaCreateChallengePayload = {
  __typename?: "CaptchaCreateChallengePayload"
  errors: Array<Error>
  result?: Maybe<CaptchaCreateChallengeResult>
}

export type CaptchaCreateChallengeResult = {
  __typename?: "CaptchaCreateChallengeResult"
  challengeCode: Scalars["String"]
  failbackMode: Scalars["Boolean"]
  id: Scalars["String"]
  newCaptcha: Scalars["Boolean"]
}

export type CaptchaRequestAuthCodeInput = {
  challengeCode: Scalars["String"]
  channel?: InputMaybe<PhoneCodeChannelType>
  phone: Scalars["Phone"]
  secCode: Scalars["String"]
  validationCode: Scalars["String"]
}

export type ColdStorageRebalanceToHotWalletInput = {
  amount: Scalars["SatAmount"]
  targetConfirmations?: InputMaybe<Scalars["TargetConfirmations"]>
  walletName: Scalars["String"]
}

export type Coordinates = {
  __typename?: "Coordinates"
  latitude: Scalars["Float"]
  longitude: Scalars["Float"]
}

export type Error = {
  code?: Maybe<Scalars["String"]>
  message: Scalars["String"]
  path?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export enum ExchangeCurrencyUnit {
  Btcsat = "BTCSAT",
  Usdcent = "USDCENT",
}

export type GraphQlApplicationError = Error & {
  __typename?: "GraphQLApplicationError"
  code?: Maybe<Scalars["String"]>
  message: Scalars["String"]
  path?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type InitiationVia =
  | InitiationViaIntraLedger
  | InitiationViaLn
  | InitiationViaOnChain

export type InitiationViaIntraLedger = {
  __typename?: "InitiationViaIntraLedger"
  counterPartyUsername?: Maybe<Scalars["Username"]>
  counterPartyWalletId?: Maybe<Scalars["WalletId"]>
}

export type InitiationViaLn = {
  __typename?: "InitiationViaLn"
  paymentHash: Scalars["PaymentHash"]
}

export type InitiationViaOnChain = {
  __typename?: "InitiationViaOnChain"
  address: Scalars["OnChainAddress"]
}

export type LightningInvoice = {
  __typename?: "LightningInvoice"
  confirmedAt?: Maybe<Scalars["Timestamp"]>
  createdAt: Scalars["Timestamp"]
  description: Scalars["String"]
  expiresAt?: Maybe<Scalars["Timestamp"]>
  isSettled: Scalars["Boolean"]
  received: Scalars["SatAmount"]
  request?: Maybe<Scalars["LnPaymentRequest"]>
  secretPreImage: Scalars["LnPaymentPreImage"]
}

export type LightningPayment = {
  __typename?: "LightningPayment"
  amount?: Maybe<Scalars["SatAmount"]>
  confirmedAt?: Maybe<Scalars["Timestamp"]>
  createdAt?: Maybe<Scalars["Timestamp"]>
  destination?: Maybe<Scalars["LnPubkey"]>
  request?: Maybe<Scalars["LnPaymentRequest"]>
  revealedPreImage?: Maybe<Scalars["LnPaymentPreImage"]>
  roundedUpFee?: Maybe<Scalars["SatAmount"]>
  status?: Maybe<LnPaymentStatus>
}

export enum LnPaymentStatus {
  Failed = "FAILED",
  Pending = "PENDING",
  Settled = "SETTLED",
}

export type Mutation = {
  __typename?: "Mutation"
  accountUpdateLevel: AccountDetailPayload
  accountUpdateStatus: AccountDetailPayload
  accountsAddUsdWallet?: Maybe<WalletDetailsPayload>
  businessUpdateMapInfo: AccountDetailPayload
  captchaCreateChallenge: CaptchaCreateChallengePayload
  captchaRequestAuthCode: SuccessPayload
  coldStorageRebalanceToHotWallet: PsbtDetailPayload
  userLogin: AuthTokenPayload
  userRequestAuthCode: SuccessPayload
}

export type MutationAccountUpdateLevelArgs = {
  input: AccountUpdateLevelInput
}

export type MutationAccountUpdateStatusArgs = {
  input: AccountUpdateStatusInput
}

export type MutationAccountsAddUsdWalletArgs = {
  input: AccountsAddUsdWalletInput
}

export type MutationBusinessUpdateMapInfoArgs = {
  input: BusinessUpdateMapInfoInput
}

export type MutationCaptchaRequestAuthCodeArgs = {
  input: CaptchaRequestAuthCodeInput
}

export type MutationColdStorageRebalanceToHotWalletArgs = {
  input: ColdStorageRebalanceToHotWalletInput
}

export type MutationUserLoginArgs = {
  input: UserLoginInput
}

export type MutationUserRequestAuthCodeArgs = {
  input: UserRequestAuthCodeInput
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo"
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]>
}

export enum PhoneCodeChannelType {
  Sms = "SMS",
  Whatsapp = "WHATSAPP",
}

/** Price amount expressed in base/offset. To calculate, use: `base / 10^offset` */
export type Price = {
  __typename?: "Price"
  base: Scalars["SafeInt"]
  currencyUnit: ExchangeCurrencyUnit
  formattedAmount: Scalars["String"]
  offset: Scalars["Int"]
}

export type PsbtDetail = {
  __typename?: "PsbtDetail"
  fee: Scalars["SatAmount"]
  transaction: Scalars["String"]
}

export type PsbtDetailPayload = {
  __typename?: "PsbtDetailPayload"
  errors: Array<Error>
  psbtDetail?: Maybe<PsbtDetail>
}

export type Query = {
  __typename?: "Query"
  accountDetailsByUserPhone: Account
  accountDetailsByUsername: Account
  allLevels: Array<AccountLevel>
  lightningInvoice: LightningInvoice
  lightningPayment: LightningPayment
  listWalletIds: Array<Scalars["WalletId"]>
  transactionById?: Maybe<Transaction>
  transactionsByHash?: Maybe<Array<Maybe<Transaction>>>
  wallet: Wallet
}

export type QueryAccountDetailsByUserPhoneArgs = {
  phone: Scalars["Phone"]
}

export type QueryAccountDetailsByUsernameArgs = {
  username: Scalars["Username"]
}

export type QueryLightningInvoiceArgs = {
  hash: Scalars["PaymentHash"]
}

export type QueryLightningPaymentArgs = {
  hash: Scalars["PaymentHash"]
}

export type QueryListWalletIdsArgs = {
  walletCurrency: WalletCurrency
}

export type QueryTransactionByIdArgs = {
  id: Scalars["ID"]
}

export type QueryTransactionsByHashArgs = {
  hash: Scalars["PaymentHash"]
}

export type QueryWalletArgs = {
  walletId: Scalars["WalletId"]
}

export type SettlementVia =
  | SettlementViaIntraLedger
  | SettlementViaLn
  | SettlementViaOnChain

export type SettlementViaIntraLedger = {
  __typename?: "SettlementViaIntraLedger"
  /** Settlement destination: Could be null if the payee does not have a username */
  counterPartyUsername?: Maybe<Scalars["Username"]>
  counterPartyWalletId?: Maybe<Scalars["WalletId"]>
}

export type SettlementViaLn = {
  __typename?: "SettlementViaLn"
  /** @deprecated Shifting property to 'preImage' to improve granularity of the LnPaymentSecret type */
  paymentSecret?: Maybe<Scalars["LnPaymentSecret"]>
  preImage?: Maybe<Scalars["LnPaymentPreImage"]>
}

export type SettlementViaOnChain = {
  __typename?: "SettlementViaOnChain"
  transactionHash: Scalars["OnChainTxHash"]
}

export type SuccessPayload = {
  __typename?: "SuccessPayload"
  errors: Array<Error>
  success?: Maybe<Scalars["Boolean"]>
}

/**
 * Give details about an individual transaction.
 * Galoy have a smart routing system which is automatically
 * settling intraledger when both the payer and payee use the same wallet
 * therefore it's possible the transactions is being initiated onchain
 * or with lightning but settled intraledger.
 */
export type Transaction = {
  __typename?: "Transaction"
  createdAt: Scalars["Timestamp"]
  direction: TxDirection
  id: Scalars["ID"]
  /** From which protocol the payment has been initiated. */
  initiationVia: InitiationVia
  memo?: Maybe<Scalars["Memo"]>
  /** Amount of the settlement currency sent or received. */
  settlementAmount: Scalars["SignedAmount"]
  /** Wallet currency for transaction. */
  settlementCurrency: WalletCurrency
  settlementFee: Scalars["SignedAmount"]
  /** Price in USDCENT/SETTLEMENTUNIT at time of settlement. */
  settlementPrice: Price
  /** To which protocol the payment has settled on. */
  settlementVia: SettlementVia
  status: TxStatus
}

/** A connection to a list of items. */
export type TransactionConnection = {
  __typename?: "TransactionConnection"
  /** A list of edges. */
  edges?: Maybe<Array<TransactionEdge>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

/** An edge in a connection. */
export type TransactionEdge = {
  __typename?: "TransactionEdge"
  /** A cursor for use in pagination */
  cursor: Scalars["String"]
  /** The item at the end of the edge */
  node: Transaction
}

export enum TxDirection {
  Receive = "RECEIVE",
  Send = "SEND",
}

export enum TxStatus {
  Failure = "FAILURE",
  Pending = "PENDING",
  Success = "SUCCESS",
}

/** A wallet belonging to an account which contains a USD balance and a list of transactions. */
export type UsdWallet = Wallet & {
  __typename?: "UsdWallet"
  accountId: Scalars["ID"]
  balance: Scalars["SignedAmount"]
  id: Scalars["ID"]
  /** An unconfirmed incoming onchain balance. */
  pendingIncomingBalance: Scalars["SignedAmount"]
  transactions?: Maybe<TransactionConnection>
  transactionsByAddress?: Maybe<TransactionConnection>
  walletCurrency: WalletCurrency
}

/** A wallet belonging to an account which contains a USD balance and a list of transactions. */
export type UsdWalletTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

/** A wallet belonging to an account which contains a USD balance and a list of transactions. */
export type UsdWalletTransactionsByAddressArgs = {
  address: Scalars["OnChainAddress"]
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

export type User = {
  __typename?: "User"
  createdAt: Scalars["Timestamp"]
  defaultAccount: Account
  id: Scalars["ID"]
  language: Scalars["Language"]
  phone: Scalars["Phone"]
}

export type UserLoginInput = {
  code: Scalars["OneTimeAuthCode"]
  phone: Scalars["Phone"]
}

export type UserRequestAuthCodeInput = {
  channel?: InputMaybe<PhoneCodeChannelType>
  phone: Scalars["Phone"]
}

/** A generic wallet which stores value in one of our supported currencies. */
export type Wallet = {
  accountId: Scalars["ID"]
  balance: Scalars["SignedAmount"]
  id: Scalars["ID"]
  pendingIncomingBalance: Scalars["SignedAmount"]
  /**
   * Transactions are ordered anti-chronologically,
   * ie: the newest transaction will be first
   */
  transactions?: Maybe<TransactionConnection>
  /**
   * Transactions are ordered anti-chronologically,
   * ie: the newest transaction will be first
   */
  transactionsByAddress?: Maybe<TransactionConnection>
  walletCurrency: WalletCurrency
}

/** A generic wallet which stores value in one of our supported currencies. */
export type WalletTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

/** A generic wallet which stores value in one of our supported currencies. */
export type WalletTransactionsByAddressArgs = {
  address: Scalars["OnChainAddress"]
  after?: InputMaybe<Scalars["String"]>
  before?: InputMaybe<Scalars["String"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
}

export enum WalletCurrency {
  Btc = "BTC",
  Usd = "USD",
}

export type WalletDetailsPayload = {
  __typename?: "WalletDetailsPayload"
  errors: Array<Error>
  walletDetails: Array<Wallet>
}

export type AccountUpdateLevelMutationVariables = Exact<{
  input: AccountUpdateLevelInput
}>

export type AccountUpdateLevelMutation = {
  __typename?: "Mutation"
  accountUpdateLevel: {
    __typename?: "AccountDetailPayload"
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
    accountDetails?: {
      __typename?: "Account"
      id: string
      username?: any | null
      level: AccountLevel
      status: AccountStatus
      title?: string | null
      createdAt: any
      owner: { __typename?: "User"; id: string; language: any; phone: any }
      coordinates?: {
        __typename?: "Coordinates"
        latitude: number
        longitude: number
      } | null
    } | null
  }
}

export type AccountUpdateStatusMutationVariables = Exact<{
  input: AccountUpdateStatusInput
}>

export type AccountUpdateStatusMutation = {
  __typename?: "Mutation"
  accountUpdateStatus: {
    __typename?: "AccountDetailPayload"
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
    accountDetails?: {
      __typename: "Account"
      id: string
      username?: any | null
      level: AccountLevel
      status: AccountStatus
      title?: string | null
      createdAt: any
      owner: { __typename?: "User"; id: string; language: any; phone: any }
      coordinates?: {
        __typename?: "Coordinates"
        latitude: number
        longitude: number
      } | null
    } | null
  }
}

export type AccountsAddUsdWalletMutationVariables = Exact<{
  input: AccountsAddUsdWalletInput
}>

export type AccountsAddUsdWalletMutation = {
  __typename?: "Mutation"
  accountsAddUsdWallet?: {
    __typename?: "WalletDetailsPayload"
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
    walletDetails: Array<
      { __typename: "BTCWallet"; id: string } | { __typename: "UsdWallet"; id: string }
    >
  } | null
}

export type BusinessUpdateMapInfoMutationVariables = Exact<{
  input: BusinessUpdateMapInfoInput
}>

export type BusinessUpdateMapInfoMutation = {
  __typename?: "Mutation"
  businessUpdateMapInfo: {
    __typename?: "AccountDetailPayload"
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
    accountDetails?: {
      __typename?: "Account"
      id: string
      username?: any | null
      level: AccountLevel
      status: AccountStatus
      title?: string | null
      createdAt: any
      owner: { __typename?: "User"; id: string; language: any; phone: any }
      coordinates?: {
        __typename?: "Coordinates"
        latitude: number
        longitude: number
      } | null
    } | null
  }
}

export type CaptchaCreateChallengeMutationVariables = Exact<{ [key: string]: never }>

export type CaptchaCreateChallengeMutation = {
  __typename?: "Mutation"
  captchaCreateChallenge: {
    __typename?: "CaptchaCreateChallengePayload"
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
    result?: {
      __typename?: "CaptchaCreateChallengeResult"
      id: string
      challengeCode: string
      newCaptcha: boolean
      failbackMode: boolean
    } | null
  }
}

export type CaptchaRequestAuthCodeMutationVariables = Exact<{
  input: CaptchaRequestAuthCodeInput
}>

export type CaptchaRequestAuthCodeMutation = {
  __typename?: "Mutation"
  captchaRequestAuthCode: {
    __typename?: "SuccessPayload"
    success?: boolean | null
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
  }
}

export type LoginMutationVariables = Exact<{
  input: UserLoginInput
}>

export type LoginMutation = {
  __typename?: "Mutation"
  userLogin: {
    __typename?: "AuthTokenPayload"
    authToken?: any | null
    errors: Array<{ __typename?: "GraphQLApplicationError"; message: string }>
  }
}

export type AccountDetailsByUserPhoneQueryVariables = Exact<{
  phone: Scalars["Phone"]
}>

export type AccountDetailsByUserPhoneQuery = {
  __typename?: "Query"
  accountDetailsByUserPhone: {
    __typename?: "Account"
    id: string
    username?: any | null
    level: AccountLevel
    status: AccountStatus
    title?: string | null
    createdAt: any
    owner: { __typename?: "User"; id: string; language: any; phone: any }
    coordinates?: {
      __typename?: "Coordinates"
      latitude: number
      longitude: number
    } | null
    wallets: Array<
      | { __typename?: "BTCWallet"; id: string; walletCurrency: WalletCurrency }
      | { __typename?: "UsdWallet"; id: string; walletCurrency: WalletCurrency }
    >
  }
}

export type AccountDetailsByUsernameQueryVariables = Exact<{
  username: Scalars["Username"]
}>

export type AccountDetailsByUsernameQuery = {
  __typename?: "Query"
  accountDetailsByUsername: {
    __typename?: "Account"
    id: string
    username?: any | null
    level: AccountLevel
    status: AccountStatus
    title?: string | null
    createdAt: any
    owner: { __typename?: "User"; id: string; language: any; phone: any }
    coordinates?: {
      __typename?: "Coordinates"
      latitude: number
      longitude: number
    } | null
    wallets: Array<
      | { __typename?: "BTCWallet"; id: string; walletCurrency: WalletCurrency }
      | { __typename?: "UsdWallet"; id: string; walletCurrency: WalletCurrency }
    >
  }
}

export type LightningInvoiceQueryVariables = Exact<{
  hash: Scalars["PaymentHash"]
}>

export type LightningInvoiceQuery = {
  __typename?: "Query"
  lightningInvoice: {
    __typename?: "LightningInvoice"
    createdAt: any
    confirmedAt?: any | null
    description: string
    expiresAt?: any | null
    isSettled: boolean
    received: any
    request?: any | null
    secretPreImage: any
  }
}

export type LightningPaymentQueryVariables = Exact<{
  hash: Scalars["PaymentHash"]
}>

export type LightningPaymentQuery = {
  __typename?: "Query"
  lightningPayment: {
    __typename?: "LightningPayment"
    createdAt?: any | null
    confirmedAt?: any | null
    status?: LnPaymentStatus | null
    amount?: any | null
    roundedUpFee?: any | null
    revealedPreImage?: any | null
    request?: any | null
    destination?: any | null
  }
}

export type TransactionByIdQueryVariables = Exact<{
  id: Scalars["ID"]
}>

export type TransactionByIdQuery = {
  __typename?: "Query"
  transactionById: {
    __typename?: "Transaction"
    id: string
    settlementAmount: any
    settlementFee: any
    direction: TxDirection
    status: TxStatus
    memo?: any | null
    createdAt: any
    initiationVia:
      | {
          __typename: "InitiationViaIntraLedger"
          counterPartyWalletId?: any | null
          counterPartyUsername?: any | null
        }
      | { __typename: "InitiationViaLn"; paymentHash: any }
      | { __typename: "InitiationViaOnChain"; address: any }
    settlementVia:
      | {
          __typename: "SettlementViaIntraLedger"
          counterPartyWalletId?: any | null
          counterPartyUsername?: any | null
        }
      | { __typename: "SettlementViaLn"; paymentSecret?: any | null }
      | { __typename: "SettlementViaOnChain"; transactionHash: any }
    settlementPrice: {
      __typename?: "Price"
      base: any
      offset: number
      currencyUnit: ExchangeCurrencyUnit
      formattedAmount: string
    }
  }
}

export type TransactionsByHashQueryVariables = Exact<{
  hash: Scalars["PaymentHash"]
}>

export type TransactionsByHashQuery = {
  __typename?: "Query"
  transactionsByHash: Array<{
    __typename?: "Transaction"
    id: string
    settlementAmount: any
    settlementFee: any
    direction: TxDirection
    status: TxStatus
    memo?: any | null
    createdAt: any
    initiationVia:
      | {
          __typename: "InitiationViaIntraLedger"
          counterPartyWalletId?: any | null
          counterPartyUsername?: any | null
        }
      | { __typename: "InitiationViaLn"; paymentHash: any }
      | { __typename: "InitiationViaOnChain"; address: any }
    settlementVia:
      | {
          __typename: "SettlementViaIntraLedger"
          counterPartyWalletId?: any | null
          counterPartyUsername?: any | null
        }
      | { __typename: "SettlementViaLn"; paymentSecret?: any | null }
      | { __typename: "SettlementViaOnChain"; transactionHash: any }
    settlementPrice: {
      __typename?: "Price"
      base: any
      offset: number
      currencyUnit: ExchangeCurrencyUnit
      formattedAmount: string
    }
  }>
}

export const AccountUpdateLevelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "accountUpdateLevel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AccountUpdateLevelInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountUpdateLevel" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accountDetails" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "level" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "language" } },
                            { kind: "Field", name: { kind: "Name", value: "phone" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "coordinates" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountUpdateLevelMutation,
  AccountUpdateLevelMutationVariables
>
export const AccountUpdateStatusDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "accountUpdateStatus" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AccountUpdateStatusInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountUpdateStatus" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accountDetails" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "level" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "language" } },
                            { kind: "Field", name: { kind: "Name", value: "phone" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "coordinates" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountUpdateStatusMutation,
  AccountUpdateStatusMutationVariables
>
export const AccountsAddUsdWalletDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "accountsAddUsdWallet" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AccountsAddUsdWalletInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountsAddUsdWallet" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "walletDetails" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountsAddUsdWalletMutation,
  AccountsAddUsdWalletMutationVariables
>
export const BusinessUpdateMapInfoDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "businessUpdateMapInfo" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "BusinessUpdateMapInfoInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "businessUpdateMapInfo" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accountDetails" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "language" } },
                            { kind: "Field", name: { kind: "Name", value: "phone" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "username" } },
                      { kind: "Field", name: { kind: "Name", value: "level" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "coordinates" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "latitude" } },
                            { kind: "Field", name: { kind: "Name", value: "longitude" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  BusinessUpdateMapInfoMutation,
  BusinessUpdateMapInfoMutationVariables
>
export const CaptchaCreateChallengeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "captchaCreateChallenge" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "captchaCreateChallenge" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "result" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "challengeCode" } },
                      { kind: "Field", name: { kind: "Name", value: "newCaptcha" } },
                      { kind: "Field", name: { kind: "Name", value: "failbackMode" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CaptchaCreateChallengeMutation,
  CaptchaCreateChallengeMutationVariables
>
export const CaptchaRequestAuthCodeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "captchaRequestAuthCode" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CaptchaRequestAuthCodeInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "captchaRequestAuthCode" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "success" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CaptchaRequestAuthCodeMutation,
  CaptchaRequestAuthCodeMutationVariables
>
export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UserLoginInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userLogin" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "message" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "authToken" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>
export const AccountDetailsByUserPhoneDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "accountDetailsByUserPhone" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "phone" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Phone" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountDetailsByUserPhone" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "phone" },
                value: { kind: "Variable", name: { kind: "Name", value: "phone" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "level" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "language" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "coordinates" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "latitude" } },
                      { kind: "Field", name: { kind: "Name", value: "longitude" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "wallets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "walletCurrency" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountDetailsByUserPhoneQuery,
  AccountDetailsByUserPhoneQueryVariables
>
export const AccountDetailsByUsernameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "accountDetailsByUsername" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Username" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountDetailsByUsername" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "username" },
                value: { kind: "Variable", name: { kind: "Name", value: "username" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "level" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "language" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "coordinates" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "latitude" } },
                      { kind: "Field", name: { kind: "Name", value: "longitude" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "wallets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "walletCurrency" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountDetailsByUsernameQuery,
  AccountDetailsByUsernameQueryVariables
>
export const LightningInvoiceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "lightningInvoice" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "hash" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "PaymentHash" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "lightningInvoice" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "hash" },
                value: { kind: "Variable", name: { kind: "Name", value: "hash" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "confirmedAt" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "expiresAt" } },
                { kind: "Field", name: { kind: "Name", value: "isSettled" } },
                { kind: "Field", name: { kind: "Name", value: "received" } },
                { kind: "Field", name: { kind: "Name", value: "request" } },
                { kind: "Field", name: { kind: "Name", value: "secretPreImage" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LightningInvoiceQuery, LightningInvoiceQueryVariables>
export const LightningPaymentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "lightningPayment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "hash" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "PaymentHash" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "lightningPayment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "hash" },
                value: { kind: "Variable", name: { kind: "Name", value: "hash" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "confirmedAt" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "amount" } },
                { kind: "Field", name: { kind: "Name", value: "roundedUpFee" } },
                { kind: "Field", name: { kind: "Name", value: "revealedPreImage" } },
                { kind: "Field", name: { kind: "Name", value: "request" } },
                { kind: "Field", name: { kind: "Name", value: "destination" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LightningPaymentQuery, LightningPaymentQueryVariables>
export const TransactionByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "transactionById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "transactionById" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "initiationVia" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaIntraLedger" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyWalletId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyUsername" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaLn" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "paymentHash" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaOnChain" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "address" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "settlementVia" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaIntraLedger" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyWalletId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyUsername" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaLn" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "paymentSecret" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaOnChain" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transactionHash" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "settlementAmount" } },
                { kind: "Field", name: { kind: "Name", value: "settlementFee" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "settlementPrice" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "base" } },
                      { kind: "Field", name: { kind: "Name", value: "offset" } },
                      { kind: "Field", name: { kind: "Name", value: "currencyUnit" } },
                      { kind: "Field", name: { kind: "Name", value: "formattedAmount" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "direction" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "memo" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransactionByIdQuery, TransactionByIdQueryVariables>
export const TransactionsByHashDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "transactionsByHash" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "hash" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "PaymentHash" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "transactionsByHash" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "hash" },
                value: { kind: "Variable", name: { kind: "Name", value: "hash" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "initiationVia" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaIntraLedger" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyWalletId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyUsername" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaLn" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "paymentHash" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "InitiationViaOnChain" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "address" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "settlementVia" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "__typename" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaIntraLedger" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyWalletId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "counterPartyUsername" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaLn" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "paymentSecret" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "SettlementViaOnChain" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transactionHash" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "settlementAmount" } },
                { kind: "Field", name: { kind: "Name", value: "settlementFee" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "settlementPrice" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "base" } },
                      { kind: "Field", name: { kind: "Name", value: "offset" } },
                      { kind: "Field", name: { kind: "Name", value: "currencyUnit" } },
                      { kind: "Field", name: { kind: "Name", value: "formattedAmount" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "direction" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "memo" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransactionsByHashQuery, TransactionsByHashQueryVariables>
