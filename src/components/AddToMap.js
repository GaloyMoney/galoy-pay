import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { validateAddToMapInputs } from '../utils'
import Header from './Header'

const ADD_TO_MAP = gql`
  mutation addToMap($username: String!, $title: String!, $latitude: Float!, $longitude: Float!) {
    addToMap(username: $username, title: $title, latitude: $latitude, longitude: $longitude)
  }
`

function AddToMap() {
  const token = sessionStorage.getItem('token')
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const [addToMap, { loading: addingToMap }] = useMutation(ADD_TO_MAP, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    onCompleted() {
      alert('Added successfully!')
      resetValues()
    },
    onError(error) {
      alert(error.message)
    }
  })

  const resetValues = () => {
    const states = [setLatitude, setLongitude, setUsername, setTitle]
    states.forEach(state => state(''))
  }

  const submit = event => {
    event.preventDefault()

    addToMap({
      variables: {
        username,
        title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    })
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
                <Form.Control
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Form.Control placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)} />
                <Form.Control
                  placeholder="Enter latitude"
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                />
                <Form.Control
                  placeholder="Enter longitude"
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                />
                <Button type="submit" disabled={!validateAddToMapInputs(username, title, latitude, longitude)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AddToMap
