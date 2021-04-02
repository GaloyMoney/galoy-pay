import { gql, useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { validatePhone, validateUsername } from '../utils'
import Header from './Header'

const GET_USER = gql`
  query getUserDetails($phone: String, $username: String) {
    getUserDetails(phone: $phone, username: $username) {
      phone
      username
      created_at
      coordinate {
        latitude
        longitude
      }
      title
      created_at
    }
  }
`

function UserDetails() {
  const token = localStorage.getItem('token')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [userDetails, setUserDetails] = useState('')

  const [getUser, { loading: gettingUser }] = useLazyQuery(GET_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    onCompleted({ getUserDetails }) {
      setUserDetails(getUserDetails)
    },
    onError(error) {
      alert(error.message)
      setUsername('')
      setPhone('')
    }
  })

  function submitPhone(event) {
    event.preventDefault()
    getUser({ variables: { phone } })
  }

  function submitUsername(event) {
    event.preventDefault()
    getUser({ variables: { username } })
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Form inline onSubmit={submitPhone}>
              <Form.Group>
                <Form.Control
                  type="tel"
                  placeholder="Enter user's phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <Button type="submit" disabled={!validatePhone(phone)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md="auto">
            <Form inline onSubmit={submitUsername}>
              <Form.Group>
                <Form.Control
                  placeholder="Enter user's username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={!validateUsername(username)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          {gettingUser && <Col md="auto">Getting user details...</Col>}
          {userDetails && (
            <Table bordered hover striped style={{ margin: '15px' }}>
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Username</th>
                  <th>Title</th>
                  <th>Latitude</th>
                  <th>Longtitude</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userDetails.phone}</td>
                  <td>{userDetails.username}</td>
                  <td>{userDetails.title}</td>
                  <td>{userDetails.coordinate ? userDetails.coordinate.latitude : ""}</td>
                  <td>{userDetails.coordinate? userDetails.coordinate.longitude : ""}</td>
                  <td>{new Date(userDetails.created_at)}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default UserDetails
