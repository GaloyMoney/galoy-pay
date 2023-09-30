import GoogleProvider from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"
import { env } from "../../../env"

const providers: Provider[] = [
  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
]

export const authOptions = {
  providers,
}
