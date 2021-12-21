import { useQuery } from "@apollo/client"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Jumbotron from "react-bootstrap/Jumbotron"
import ListGroup from "react-bootstrap/ListGroup"
import Row from "react-bootstrap/Row"
import { GRAPHQL_URI } from "../lib/config"
import GET_NODE_STATS from "./get-node-stats.gql"

function Home() {
  const nodeUrl =
    GRAPHQL_URI.indexOf("testnet") === -1
      ? `https://1ml.com/node/`
      : `https://1ml.com/testnet/node/`

  const { loading, error, data } = useQuery(GET_NODE_STATS)

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <h2>Connect to the Bitcoin Beach Lightning Node</h2>
          <br />
          <Jumbotron>
            <Container>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <label>Node Public Key: </label>{" "}
                          <p style={{ fontSize: "small", overflowWrap: "break-word" }}>
                            {error
                              ? "Unavailable"
                              : loading
                              ? "Loading..."
                              : data.globals.nodesIds[0]}
                          </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {error ? (
                            "Unavailable"
                          ) : loading ? (
                            "Loading..."
                          ) : (
                            <a href={nodeUrl + `${data.globals.nodesIds[0]}`}>
                              Connect the Bitcoin Beach Lightning node
                            </a>
                          )}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <hr />
            </Container>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
