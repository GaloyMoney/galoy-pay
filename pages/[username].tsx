import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"
import ReceiveAmount from "../components/receive-amount"
import ReceiveNoAmount from "../components/receive-no-amount"
import { appStoreLink, getOS, playStoreLink } from "../lib/download"
import RECIPIENT_WALLET_ID from "./recipient-wallet-id.gql"

export default function Receive() {
  const router = useRouter()
  const { username, amount } = router.query

  const { error, loading, data } = useQuery(RECIPIENT_WALLET_ID, {
    variables: {
      username,
    },
  })

  const os = getOS()

  if (error) return <div className="error">{error.message}</div>
  if (loading) return <div className="loading">Loading...</div>
  if (!data) return null

  const { recipientWalletId } = data

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
              <ReceiveAmount recipientWalletId={recipientWalletId} />
            ) : (
              <ReceiveNoAmount
                recipientWalletId={recipientWalletId}
                onSetAmountClick={onSetAmountClick}
              />
            )}

            <Card.Body>
              {os === "android" && (
                <a href={playStoreLink}>
                  <Image src="/google-play-badge.png" height="40px" rounded />
                </a>
              )}
              {os === "ios" && (
                <a href={playStoreLink}>
                  <Image src="/apple-app-store.png" height="40px" rounded />
                </a>
              )}
              {os === undefined && (
                <div>
                  <a href={appStoreLink}>
                    <Image src="/apple-app-store.png" height="45px" rounded />
                  </a>
                  &nbsp;
                  <a href={playStoreLink}>
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
