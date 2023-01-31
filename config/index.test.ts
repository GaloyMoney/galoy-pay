/**
 * @jest-environment jsdom
 */

import config from "./index"

describe("config", () => {
  const ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
    // @ts-expect-error
    delete window.location
    // @ts-expect-error
    window.location = new URL("https://admin.xyz.example.com")
  })

  afterAll(() => {
    process.env = ENV
  })

  it("uses process.env if that's set", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = "test.url"
    const { GRAPHQL_URL } = config()
    expect(GRAPHQL_URL).toBe("test.url")
  })

  it("uses window.location if no variable is set in process.env", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = undefined
    const { GRAPHQL_URL } = config()
    expect(GRAPHQL_URL).toBe("https://admin-api.xyz.example.com/graphql")
  })

  it("works only for a.b.c.d domains", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = undefined
    // @ts-expect-error
    window.location = new URL("https://example.com")
    const config = require("./index").default
    expect(() => config()).toThrow()
  })
})
