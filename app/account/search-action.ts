"use server"

import { redirect } from "next/navigation"
import {
  AccountDetailsByEmailDocument,
  AccountDetailsByEmailQuery,
  AccountDetailsByUserPhoneDocument,
  AccountDetailsByUserPhoneQuery,
  AccountDetailsByUsernameDocument,
  AccountDetailsByUsernameQuery,
} from "../../generated"
import { getClient } from "../graphql-rsc"
import { validEmail, validPhone, validUsername } from "../utils"

export const accountSearch = async (_prevState: unknown, formData: FormData) => {
  const search = formData.get("search") as string

  if (!search) {
    throw new Error("Please enter a value")
  }

  if (validPhone(search)) {
    let uuid: string | undefined

    try {
      const data = await getClient().query<AccountDetailsByUserPhoneQuery>({
        query: AccountDetailsByUserPhoneDocument,
        variables: { phone: search },
      })
      uuid = data.data?.accountDetailsByUserPhone.uuid
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }

    if (uuid) {
      redirect(`/account/${uuid}`)
    }
  }
  if (validUsername(search)) {
    let uuid: string | undefined

    try {
      const data = await getClient().query<AccountDetailsByUsernameQuery>({
        query: AccountDetailsByUsernameDocument,
        variables: { username: search },
      })
      uuid = data.data?.accountDetailsByUsername.uuid
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }
    if (uuid) {
      redirect(`/account/${uuid}`)
    }
  }
  if (validEmail(search)) {
    let uuid: string | undefined

    try {
      const data = await getClient().query<AccountDetailsByEmailQuery>({
        query: AccountDetailsByEmailDocument,
        variables: { email: search },
      })

      uuid = data.data?.accountDetailsByEmail.uuid
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }

    if (uuid) {
      redirect(`/account/${uuid}`)
    }
  }

  return { message: "Please enter a full phone number, username or email" }
}
