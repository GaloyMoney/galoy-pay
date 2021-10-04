import { gql, useMutation } from "@apollo/client"
import * as React from "react"
import { Container, Form } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { validAddToMapInputs } from "../utils"
import Header from "./Header"

const BUSINESS_UPDATE_MAP_INFO = gql`
  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {
    mutationData: businessUpdateMapInfo(input: $input) {
      errors {
        message
      }
      userDetails {
        id
      }
    }
  }
`

function AddToMap() {
  const [businessUpdateMapInfo] = useMutation(BUSINESS_UPDATE_MAP_INFO)

  const submit = async (event) => {
    event.preventDefault()

    const { username, title, longitude, latitude } = event.target

    const businessInfo = {
      username: username.value,
      title: title.value,
      longitude: parseFloat(longitude.value),
      latitude: parseFloat(latitude.value),
    }

    if (!validAddToMapInputs(businessInfo)) {
      alert("Invalid input values")
      return
    }

    const { data, errors } = await businessUpdateMapInfo({
      variables: {
        input: businessInfo,
      },
    })

    // TODO: update UI (instead of alerts)

    if (errors || data?.mutationData?.errors.length > 0) {
      console.error({ errors, userErrors: data.mutationData.errors })
      alert("Error adding merchant to map")
    } else {
      alert("Added successfully!")
    }

    username.value = ""
    title.value = ""
    longitude.value = ""
    latitude.value = ""
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Form onSubmit={submit}>
              <Form.Group>
                <Form.Control placeholder="Enter user name" name="username" />
                <Form.Control placeholder="Enter title" name="title" />
                <Form.Control placeholder="Enter latitude" name="latitude" />
                <Form.Control placeholder="Enter longitude" name="longitude" />
                <Button type="submit">Submit</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AddToMap
