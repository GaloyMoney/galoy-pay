import { QRCode } from "react-qrcode-logo"
import Image from "react-bootstrap/Image"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import getConfig from "next/config"

import { getOS } from "../lib/download"

const { publicRuntimeConfig } = getConfig()
const ios = publicRuntimeConfig.storeLinks.ios
const stores = {
  ...publicRuntimeConfig.storeLinks,
  ios: (ios || "").replace("https://apps.apple.com/", "itms-apps://itunes.apple.com/"),
}

function DownloadApp() {
  const os = getOS()
  if (os) {
    window.location.replace(stores[os])
  }

  return (
    <Container>
      <br />
      <h3>Download the {publicRuntimeConfig.appName} Wallet</h3>
      <br />
      <Row>
        <Col>
          <a href={ios}>
            <Image src="/apple-app-store.png" rounded />
          </a>
          <br />
          <br />
        </Col>
        <Col>
          <a href={stores.android}>
            <Image src="/google-play-badge.png" rounded />
          </a>
        </Col>
        <Col>
          <div style={{ width: 200 }}>
            <Button href={stores.apk} block variant="outline-dark">
              Download APK
              <br /> for Android
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <QRCode value={ios} size={200} />
        </Col>
        <Col>
          <QRCode value={stores.android} size={200} />
        </Col>
        <Col>
          <QRCode value={stores.apk} size={200} />
        </Col>
      </Row>
    </Container>
  )
}

export default DownloadApp
