# Admin-Panel

## What is it for?

Admin Panel lets the support team access users and internal transaction information.

Admin Panel is packaged as a docker image, and is automatically installed as part of the galoy helm charts.

With a default installation, Admin Panel can be accessed with `admin.domain.com`. Admin-Panel fetches information from a dedicated graphql API endpoint `graphql-admin.domain.com` defined in [graphql-admin-server](https://github.com/GaloyMoney/galoy/blob/main/src/servers/graphql-admin-server.ts)

## How to run this repo locally?

This project uses Next.js, to run it locally, you need to set the following environment variables (in a `.env.local` file):

```
export NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4002/admin/graphql
export NEXT_PUBLIC_GALOY_AUTH_ENDPOINT=http://localhost:4002/auth
```

for staging:

```
export NEXT_PUBLIC_GRAPHQL_URL=https://admin-api.staging.galoy.io/graphql
export NEXT_PUBLIC_GALOY_AUTH_ENDPOINT=https://admin-api.staging.galoy.io/auth
```

Then, in the project directory, you can run:

```
yarn install
yarn dev
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
