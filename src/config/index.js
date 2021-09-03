export const GRAPHQL_URI = process.env.GRAPHQL_URI

if (!GRAPHQL_URI) {
  throw new Error("Missing env variables")
}
