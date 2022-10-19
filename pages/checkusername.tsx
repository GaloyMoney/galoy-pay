import { useRouter } from "next/router"
import { getOS } from "../lib/download"

const CheckUsername = () => {
  const os = getOS()
  const router = useRouter()

  const username_from_local = localStorage.getItem("username")
  if (os === "ios") {
    if (!username_from_local || username_from_local == null) {
      router.push({
        pathname: `/`,
        query: undefined,
      })
    } else {
      router.push({
        pathname: `/merchant/${username_from_local}`,
        query: undefined,
      })
    }
  } else {
    if (!username_from_local || username_from_local === null) {
      router.push({
        pathname: `/`,
        query: undefined,
      })
    }

    router.push({
      pathname: `/merchant/${username_from_local}`,
      query: undefined,
    })
  }

  return null
}

export default CheckUsername
