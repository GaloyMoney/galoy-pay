describe("config", () => {
  const ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
    delete window.location
    window.location = new URL("https://admin.mainnet.galoy.io")
  })

  afterAll(() => {
    process.env = ENV
  })

  it("uses process.env if that's set", () => {
    process.env.GRAPHQL_URI = "test.url"
    const config = require("./index").default
    const { GRAPHQL_URI } = config()
    expect(GRAPHQL_URI).toBe("test.url")
  })

  it("uses window.location if no variable is set in process.env", () => {
    process.env.GRAPHQL_URI = undefined
    const config = require("./index").default
    const { GRAPHQL_URI } = config()
    expect(GRAPHQL_URI).toBe("https://admin-api.mainnet.galoy.io/graphql")
  })

  it("works only for a.b.c.d domains", () => {
    process.env.GRAPHQL_URI = undefined
    delete window.location
    window.location = new URL("https://galoy.io")
    const config = require("./index").default
    expect(() => config()).toThrow()
  })
})
