import React, { useEffect } from "react"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Jumbotron from "react-bootstrap/Jumbotron"
import ListGroup from "react-bootstrap/ListGroup"
import Row from "react-bootstrap/Row"
import { gql, useQuery } from "@apollo/client"

import { GRAPHQL_URI } from "../lib/config"
import { useRouter } from "next/router"
import { useDisplayCurrency } from "../lib/use-display-currency"
import { usePriceConversion } from "../lib/use-price-conversion"
import { useCurrencyListQuery } from "../lib/graphql/generated"
import { DisplayCurrency } from "../lib/types/amounts"

const GET_NODE_STATS = gql`
  query nodeIds {
    globals {
      nodesIds
    }
  }
`

function Home() {
  const nodeUrl = GRAPHQL_URI.includes("staging")
    ? `https://mempool.space/signet/lightning/node/`
    : `https://mempool.space/lightning/node/`
  const { loading, error, data } = useQuery(GET_NODE_STATS)
  const { formatCurrency } = useDisplayCurrency()
  const result = usePriceConversion()
  const { data: currencyData } = useCurrencyListQuery()
  const [selectedDisplayCurrency, setSelectedDisplayCurrency] = React.useState("EUR")

  const router = useRouter()
  const [username, setUsername] = React.useState<string>("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    router.push(
      {
        pathname: username,
        query: { display: selectedDisplayCurrency ?? "USD" },
      },
      undefined,
      { shallow: true },
    )
  }

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
                        <ListGroup.Item>
                          <form
                            className="username-form"
                            autoComplete="off"
                            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
                              handleSubmit(event)
                            }
                          >
                            <label htmlFor="username">
                              To use the <strong>POS</strong> app, enter your bitcoin
                              beach username
                            </label>
                            <input
                              type="text"
                              name="username"
                              value={username}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setUsername(event.target.value)
                              }
                              placeholder="username"
                              required
                            />
                            <label htmlFor="display">Enter your currency</label>
                            <select
                              style={{ height: "42px" }}
                              name="display"
                              placeholder="USD"
                              required
                              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                const currencyId = event.target.value
                                const newDisplayCurrency =
                                  currencyData?.currencyList?.find(
                                    (item) => item.id === currencyId,
                                  )
                                if (newDisplayCurrency) {
                                  setSelectedDisplayCurrency(newDisplayCurrency.id)
                                  const formatted = formatCurrency({
                                    amountInMajorUnits: 1,
                                    currency: newDisplayCurrency.id,
                                    withSign: true,
                                  })
                                  console.log("formatted", formatted)
                                }
                              }}
                            >
                              {currencyData?.currencyList?.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.id}
                                </option>
                              ))}
                            </select>
                            <button>Submit</button>
                          </form>
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
