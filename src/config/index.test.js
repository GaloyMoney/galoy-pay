describe("config", () => {
  const ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
    delete window.location
    window.location = new URL("https://admin.xyz.example.com")
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
    expect(GRAPHQL_URI).toBe("https://admin-api.xyz.example.com/graphql")
  })

  it("works only for a.b.c.d domains", () => {
    process.env.GRAPHQL_URI = undefined
    delete window.location
    window.location = new URL("https://example.com")
    const config = require("./index").default
    expect(() => config()).toThrow()
  })
})
