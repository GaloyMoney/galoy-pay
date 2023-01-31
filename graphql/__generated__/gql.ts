/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  mutation accountUpdateLevel($input: AccountUpdateLevelInput!) {\n    accountUpdateLevel(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n": types.AccountUpdateLevelDocument,
    "\n  mutation accountUpdateStatus($input: AccountUpdateStatusInput!) {\n    accountUpdateStatus(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        __typename\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n": types.AccountUpdateStatusDocument,
    "\n  mutation accountsAddUsdWallet($input: AccountsAddUsdWalletInput!) {\n    accountsAddUsdWallet(input: $input) {\n      errors {\n        message\n      }\n      walletDetails {\n        __typename\n        id\n      }\n    }\n  }\n": types.AccountsAddUsdWalletDocument,
    "\n  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {\n    businessUpdateMapInfo(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        owner {\n          id\n          language\n          phone\n        }\n        username\n        level\n        status\n        title\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n": types.BusinessUpdateMapInfoDocument,
    "\n  mutation captchaCreateChallenge {\n    captchaCreateChallenge {\n      errors {\n        message\n      }\n      result {\n        id\n        challengeCode\n        newCaptcha\n        failbackMode\n      }\n    }\n  }\n": types.CaptchaCreateChallengeDocument,
    "\n  mutation captchaRequestAuthCode($input: CaptchaRequestAuthCodeInput!) {\n    captchaRequestAuthCode(input: $input) {\n      errors {\n        message\n      }\n      success\n    }\n  }\n": types.CaptchaRequestAuthCodeDocument,
    "\n  mutation login($input: UserLoginInput!) {\n    userLogin(input: $input) {\n      errors {\n        message\n      }\n      authToken\n    }\n  }\n": types.LoginDocument,
    "\n  query accountDetailsByUserPhone($phone: Phone!) {\n    accountDetailsByUserPhone(phone: $phone) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n": types.AccountDetailsByUserPhoneDocument,
    "\n  query accountDetailsByUsername($username: Username!) {\n    accountDetailsByUsername(username: $username) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n": types.AccountDetailsByUsernameDocument,
    "\n  query lightningInvoice($hash: PaymentHash!) {\n    lightningInvoice(hash: $hash) {\n      createdAt\n      confirmedAt\n      description\n      expiresAt\n      isSettled\n      received\n      request\n      secretPreImage\n    }\n  }\n": types.LightningInvoiceDocument,
    "\n  query lightningPayment($hash: PaymentHash!) {\n    lightningPayment(hash: $hash) {\n      createdAt\n      confirmedAt\n      status\n      amount\n      roundedUpFee\n      revealedPreImage\n      request\n      destination\n    }\n  }\n": types.LightningPaymentDocument,
    "\n  query transactionById($id: ID!) {\n    transactionById(id: $id) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n": types.TransactionByIdDocument,
    "\n  query transactionsByHash($hash: PaymentHash!) {\n    transactionsByHash(hash: $hash) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n": types.TransactionsByHashDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation accountUpdateLevel($input: AccountUpdateLevelInput!) {\n    accountUpdateLevel(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation accountUpdateLevel($input: AccountUpdateLevelInput!) {\n    accountUpdateLevel(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation accountUpdateStatus($input: AccountUpdateStatusInput!) {\n    accountUpdateStatus(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        __typename\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation accountUpdateStatus($input: AccountUpdateStatusInput!) {\n    accountUpdateStatus(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        __typename\n        id\n        username\n        level\n        status\n        title\n        owner {\n          id\n          language\n          phone\n        }\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation accountsAddUsdWallet($input: AccountsAddUsdWalletInput!) {\n    accountsAddUsdWallet(input: $input) {\n      errors {\n        message\n      }\n      walletDetails {\n        __typename\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation accountsAddUsdWallet($input: AccountsAddUsdWalletInput!) {\n    accountsAddUsdWallet(input: $input) {\n      errors {\n        message\n      }\n      walletDetails {\n        __typename\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {\n    businessUpdateMapInfo(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        owner {\n          id\n          language\n          phone\n        }\n        username\n        level\n        status\n        title\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {\n    businessUpdateMapInfo(input: $input) {\n      errors {\n        message\n      }\n      accountDetails {\n        id\n        owner {\n          id\n          language\n          phone\n        }\n        username\n        level\n        status\n        title\n        coordinates {\n          latitude\n          longitude\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation captchaCreateChallenge {\n    captchaCreateChallenge {\n      errors {\n        message\n      }\n      result {\n        id\n        challengeCode\n        newCaptcha\n        failbackMode\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation captchaCreateChallenge {\n    captchaCreateChallenge {\n      errors {\n        message\n      }\n      result {\n        id\n        challengeCode\n        newCaptcha\n        failbackMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation captchaRequestAuthCode($input: CaptchaRequestAuthCodeInput!) {\n    captchaRequestAuthCode(input: $input) {\n      errors {\n        message\n      }\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation captchaRequestAuthCode($input: CaptchaRequestAuthCodeInput!) {\n    captchaRequestAuthCode(input: $input) {\n      errors {\n        message\n      }\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($input: UserLoginInput!) {\n    userLogin(input: $input) {\n      errors {\n        message\n      }\n      authToken\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: UserLoginInput!) {\n    userLogin(input: $input) {\n      errors {\n        message\n      }\n      authToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query accountDetailsByUserPhone($phone: Phone!) {\n    accountDetailsByUserPhone(phone: $phone) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query accountDetailsByUserPhone($phone: Phone!) {\n    accountDetailsByUserPhone(phone: $phone) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query accountDetailsByUsername($username: Username!) {\n    accountDetailsByUsername(username: $username) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query accountDetailsByUsername($username: Username!) {\n    accountDetailsByUsername(username: $username) {\n      id\n      username\n      level\n      status\n      title\n      owner {\n        id\n        language\n        phone\n      }\n      coordinates {\n        latitude\n        longitude\n      }\n      wallets {\n        id\n        walletCurrency\n      }\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query lightningInvoice($hash: PaymentHash!) {\n    lightningInvoice(hash: $hash) {\n      createdAt\n      confirmedAt\n      description\n      expiresAt\n      isSettled\n      received\n      request\n      secretPreImage\n    }\n  }\n"): (typeof documents)["\n  query lightningInvoice($hash: PaymentHash!) {\n    lightningInvoice(hash: $hash) {\n      createdAt\n      confirmedAt\n      description\n      expiresAt\n      isSettled\n      received\n      request\n      secretPreImage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query lightningPayment($hash: PaymentHash!) {\n    lightningPayment(hash: $hash) {\n      createdAt\n      confirmedAt\n      status\n      amount\n      roundedUpFee\n      revealedPreImage\n      request\n      destination\n    }\n  }\n"): (typeof documents)["\n  query lightningPayment($hash: PaymentHash!) {\n    lightningPayment(hash: $hash) {\n      createdAt\n      confirmedAt\n      status\n      amount\n      roundedUpFee\n      revealedPreImage\n      request\n      destination\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query transactionById($id: ID!) {\n    transactionById(id: $id) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query transactionById($id: ID!) {\n    transactionById(id: $id) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query transactionsByHash($hash: PaymentHash!) {\n    transactionsByHash(hash: $hash) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query transactionsByHash($hash: PaymentHash!) {\n    transactionsByHash(hash: $hash) {\n      id\n      initiationVia {\n        __typename\n        ... on InitiationViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on InitiationViaLn {\n          paymentHash\n        }\n        ... on InitiationViaOnChain {\n          address\n        }\n      }\n      settlementVia {\n        __typename\n        ... on SettlementViaIntraLedger {\n          counterPartyWalletId\n          counterPartyUsername\n        }\n        ... on SettlementViaLn {\n          paymentSecret\n        }\n        ... on SettlementViaOnChain {\n          transactionHash\n        }\n      }\n      settlementAmount\n      settlementFee\n      settlementPrice {\n        base\n        offset\n        currencyUnit\n        formattedAmount\n      }\n      direction\n      status\n      memo\n      createdAt\n    }\n  }\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;