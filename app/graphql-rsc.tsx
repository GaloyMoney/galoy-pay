import { HttpLink } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr"
import { cookies } from "next/headers"
import { env } from "./env"

export const { getClient } = registerApolloClient(() => {
  const cookieStore = cookies()

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: env.ADMIN_CORE_API,

      fetchOptions: { cache: "no-store" },
      headers: {
        cookie: cookieStore.toString(),
      },
    }),
  })
})
