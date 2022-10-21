import { useRouter } from "next/router"
import React from "react"

const SetupPwa = () => {
  const router = useRouter()
  const [username, setUsername] = React.useState<string>("")

  let accountUsername: string
  const username_from_local = localStorage.getItem("username")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (accountUsername === "" || !accountUsername) {
      localStorage.setItem("username", username)
    }

    router.push(
      {
        pathname: `/merchant/${username}`,
      },
      undefined,
      { shallow: true },
    )
  }

  if (username_from_local != null || username_from_local) {
    accountUsername = username_from_local
    router.push(
      {
        pathname: `/merchant/${accountUsername}`,
      },
      undefined,
      { shallow: true },
    )
  }

  if (username_from_local == null || !username_from_local) {
    accountUsername = ""
    return (
      <div className="setup-pwa">
        <form
          className="username-form"
          autoComplete="off"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleSubmit(event)}
        >
          <h4>Welcome to Bitcoin beach POS application.</h4>
          <label htmlFor="username">
            To use the app, enter your bitcoin beach username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            placeholder="username"
            required
          />
          <button>Submit</button>
        </form>
      </div>
    )
  }
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>
    </div>
  )
}

export default SetupPwa
