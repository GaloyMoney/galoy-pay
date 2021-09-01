import { gql, useLazyQuery, useMutation } from "@apollo/client"
import * as React from "react"
import { Container, Form } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Table from "react-bootstrap/Table"
import { validPhone, validWalletName, reportError } from "../utils"
import Header from "./Header"

// TODO: use fragment for userDetails

const GET_USER_BY_PHONE = gql`
  query getUserDetails($phone: Phone!) {
    userDetails: userDetailsByPhone(phone: $phone) {
      id
      phone
      walletName
      level
      status
      title
      coordinates {
        latitude
        longitude
      }
      createdAt
    }
  }
`

const GET_USER_BY_USERNAME = gql`
  query getUserDetails($walletName: WalletName!) {
    userDetails: userDetailsByWalletName(walletName: $walletName) {
      id
      phone
      walletName
      level
      status
      title
      coordinates {
        latitude
        longitude
      }
      createdAt
    }
  }
`

const USER_UPDATE_STATUS = gql`
  mutation userUpdateStatus($input: UserUpdateStatusInput!) {
    mutationData: userUpdateStatus(input: $input) {
      errors {
        message
      }
      userDetails {
        id
        phone
        walletName
        level
        status
        title
        coordinates {
          latitude
          longitude
        }
        createdAt
      }
    }
  }
`

const USER_UPDATE_LEVEL = gql`
  mutation userUpdateLevel($input: UserUpdateLevelInput!) {
    mutationData: userUpdateLevel(input: $input) {
      errors {
        message
      }
      userDetails {
        id
        phone
        walletName
        level
        status
        title
        coordinates {
          latitude
          longitude
        }
        createdAt
      }
    }
  }
`

// TODO: Split into 3 components
function UserDetails() {
  const [phone, setPhone] = React.useState("")
  const [walletName, setWalletName] = React.useState("")
  const [userDetails, setUserDetails] = React.useState("")

  // TODO: get rid of onCompleted and use hooks data directly

  const [getUserByPhone, { loading: gettingUserByPhone }] = useLazyQuery(
    GET_USER_BY_PHONE,
    {
      onCompleted({ userDetails }) {
        setUserDetails(userDetails)
      },
      onError(error) {
        reportError(error.message)
        setPhone("")
      },
    },
  )
  const [getUserByUsername, { loading: gettingUserByUsername }] = useLazyQuery(
    GET_USER_BY_USERNAME,
    {
      onCompleted({ userDetails }) {
        setUserDetails(userDetails)
      },
      onError(error) {
        reportError(error.message)
        setWalletName("")
      },
    },
  )

  const [updateUserStatus] = useMutation(USER_UPDATE_STATUS, {
    onCompleted({ mutationData }) {
      setUserDetails(mutationData.userDetails)
      alert(`${userDetails.walletName}'s account level has been changed successfully`)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
    },
  })

  const [updateUserLevel] = useMutation(USER_UPDATE_LEVEL, {
    onCompleted({ mutationData }) {
      setUserDetails(mutationData.userDetails)
      alert(`${userDetails.walletName}'s account status has been changed successfully`)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
    },
  })

  function submitPhone(event) {
    event.preventDefault()
    getUserByPhone({ variables: { phone } })
  }

  function submitUsername(event) {
    event.preventDefault()
    getUserByUsername({ variables: { walletName } })
  }

  function changeAccountStatus() {
    const targetStatus = userDetails.status === "ACTIVE" ? "LOCKED" : "ACTIVE"
    const confirmation = window.confirm(
      `Clicking OK will change ${userDetails.phone}'s status to ${targetStatus}. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateUserStatus({
        variables: { input: { uid: userDetails.id, status: targetStatus } },
      })
    }
  }

  function changeLevel() {
    updateUserLevel({ variables: { input: { uid: userDetails.id, level: "TWO" } } })
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
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="submit" disabled={!validPhone(phone)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md="auto">
            <Form inline onSubmit={submitUsername}>
              <Form.Group>
                <Form.Control
                  placeholder="Enter user's wallet name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
                <Button type="submit" disabled={!validWalletName(walletName)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          {(gettingUserByPhone || gettingUserByUsername) && (
            <Col md="auto">Getting user details...</Col>
          )}
          {userDetails && (
            <Table bordered hover striped style={{ margin: "15px" }}>
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Wallet Name</th>
                  <th>Title</th>
                  <th>Latitude</th>
                  <th>Longtitude</th>
                  <th>Created At</th>
                  <th>Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userDetails.phone}</td>
                  <td>{userDetails.walletName}</td>
                  <td>{userDetails.title}</td>
                  <td>
                    {userDetails.coordinates ? userDetails.coordinates.latitude : ""}
                  </td>
                  <td>
                    {userDetails.coordinates ? userDetails.coordinates.longitude : ""}
                  </td>
                  <td>{new Date(parseInt(userDetails.createdAt)).toString()}</td>
                  <td>
                    {userDetails.level}{" "}
                    <Button
                      variant="outline-danger"
                      disabled={userDetails.level === "TWO"}
                      size="sm"
                      onClick={changeLevel}
                    >
                      Upgrade
                    </Button>{" "}
                  </td>
                  <td>
                    {userDetails.status}{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={changeAccountStatus}
                    >
                      Change
                    </Button>{" "}
                  </td>
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
