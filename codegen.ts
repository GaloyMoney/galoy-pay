import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema:
    "https://raw.githubusercontent.com/GaloyMoney/galoy/main/src/graphql/admin/schema.graphql",
  documents: ["graphql/**/*.ts"],
  generates: {
    "./graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        inlineFragmentTypes: "combine",
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
