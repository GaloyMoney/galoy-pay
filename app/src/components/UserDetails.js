import { gql, useLazyQuery, useMutation } from '@apollo/client'
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
      id
      phone
      username
      created_at
      coordinate {
        latitude
        longitude
      }
      title
      created_at
      status
    }
  }
`

const SET_ACCOUNT_STATUS = gql`
  mutation setAccountStatus($username: String, $phone: String, $status: AccountStatus!) {
    setAccountStatus(username: $username, phone: $phone, status: $status) {
        status
        id
        __typename
    }
  }
`

function UserDetails() {
  const token = sessionStorage.getItem('token')
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

  const [setAccountStatus] = useMutation(SET_ACCOUNT_STATUS, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    onCompleted({ setAccountStatus }) {
      console.log({ setAccountStatus })
      alert(`${userDetails.username}'s account status has been changed successfully`)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
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

  function changeAccountStatus() {
    const targetStatus = userDetails.status === "active" ? "locked" : "active"
    const confirmation = window.confirm(`Clicking OK will change ${userDetails.phone}'s status to ${targetStatus}. Do you wish to proceed?`)
    if (confirmation) {
      setAccountStatus({ variables: { phone: userDetails.phone, status: targetStatus } })
    }
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userDetails.phone}</td>
                  <td>{userDetails.username}</td>
                  <td>{userDetails.title}</td>
                  <td>{userDetails.coordinate ? userDetails.coordinate.latitude : ""}</td>
                  <td>{userDetails.coordinate ? userDetails.coordinate.longitude : ""}</td>
                  <td>{new Date(parseInt(userDetails.created_at)).toString()}</td>
                  <td>{userDetails.status} <Button variant="outline-danger" size='sm' onClick={changeAccountStatus}>Change</Button> </td>
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
