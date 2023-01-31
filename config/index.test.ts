import config from "./index"

describe("config", () => {
  const ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
  })

  afterAll(() => {
    process.env = ENV
  })

  it("uses process.env", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = "test.url"
    const { GRAPHQL_URL } = config()
    expect(GRAPHQL_URL).toBe("test.url")
  })
})
