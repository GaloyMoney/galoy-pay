import { Container, Form, InputGroup } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { validatePhone } from "../utils";
import Header from "./Header";

const GET_USER = gql`
  query getUserFromPhone($phone: String!) {
    getUserFromPhone(phone: $phone) {
      phone
      username
      created_at
      coordinate {
        latitude
        longitude
      }
      title
    }
  }
`;

function Dashboard() {
  const [phone, setPhone] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const [getUser, { loading: gettingUser }] = useLazyQuery(GET_USER, {
    onCompleted({ getUserFromPhone }) {
      setUserDetails(getUserFromPhone);
    },
    onError(error) {
      console.error(error);
    },
  });

  function submitPhone(event) {
    event.preventDefault();
    console.log({ phone });
    getUser({ variables: { phone } });
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto" style={{ display: "flex", justifyContent: "center" }}>
            <Form inline onSubmit={submitPhone}>
              <Form.Group>
                <Form.Control
                  type="tel"
                  placeholder="Enter user's phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="submit" disabled={!validatePhone(phone)}>
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          {gettingUser && <p>Getting user details...</p>}
          {userDetails && (
            <Table bordered hover striped>
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Username</th>
                  <th>Title</th>
                  <th>Latitude</th>
                  <th>Longtitude</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userDetails.phone}</td>
                  <td>{userDetails.username}</td>
                  <td>{userDetails.title}</td>
                  <td>{userDetails.coordinate.latitude}</td>
                  <td>{userDetails.coordinate.longitude}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
