import { useRouter } from "next/router"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Image from "react-bootstrap/Image"
import { gql, useQuery } from "@apollo/client"

import ReceiveAmount from "../components/receive-amount"
import ReceiveNoAmount from "../components/receive-no-amount"
import getConfig from "next/config"

import { getOS } from "../lib/download"

const { publicRuntimeConfig } = getConfig()
const stores = publicRuntimeConfig.storeLinks

const RECIPIENT_WALLET_ID = gql`
  query accountDefaultWallet($username: Username!) {
    accountDefaultWallet(username: $username) {
      id
      walletCurrency
    }
  }
`

export default function Receive() {
  const router = useRouter()
  const { username, amount } = router.query

  const { error, loading, data } = useQuery(RECIPIENT_WALLET_ID, {
    variables: {
      username,
    },
  })

  if (error) return <div className="error">{error.message}</div>
  if (loading) return <div className="loading">Loading...</div>
  if (!data) return null

  const os = getOS()

  const { id: recipientWalletId, walletCurrency: recipientWalletCurrency } =
    data.accountDefaultWallet

  const isAmountInvoice = amount !== undefined

  const onSetAmountClick = () => {
    router.push(`/${username}?amount=0&currency=USD`, undefined, { shallow: true })
  }

  return (
    <Container className="invoice-container" fluid>
      {os === undefined && <br />}
      <Row className="justify-content-md-center">
        <Col md="auto" style={{ padding: 0 }}>
          <Card className="text-center">
            <Card.Header>Pay {username}</Card.Header>

            {isAmountInvoice ? (
              <ReceiveAmount
                recipientWalletId={recipientWalletId}
                recipientWalletCurrency={recipientWalletCurrency}
              />
            ) : (
              <ReceiveNoAmount
                recipientWalletId={recipientWalletId}
                onSetAmountClick={onSetAmountClick}
              />
            )}

            <Card.Body>
              {os === "android" && (
                <a href={stores.android}>
                  <Image src="/google-play-badge.png" height="40px" rounded />
                </a>
              )}
              {os === "ios" && (
                <a href={stores.ios}>
                  <Image src="/apple-app-store.png" height="40px" rounded />
                </a>
              )}
              {os === "huawei" && (
                <Button
                  style={{ width: 150 }}
                  href={stores.apk}
                  block
                  variant="outline-dark"
                >
                  Download APK
                  <br /> for Android
                </Button>
              )}
              {os === undefined && (
                <div>
                  <a href={stores.ios}>
                    <Image src="/apple-app-store.png" height="45px" rounded />
                  </a>
                  &nbsp;
                  <a href={stores.android}>
                    <Image src="/google-play-badge.png" height="45px" rounded />
                  </a>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              Powered by <Card.Link href="https://galoy.io">Galoy </Card.Link>
              <br />
              <Card.Link href={window.location.origin}>Open a channel with us</Card.Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <br />
    </Container>
  )
}
