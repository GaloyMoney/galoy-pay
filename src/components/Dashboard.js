import React from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Header from "./Header";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <Container fluid style={{ marginTop: "50px" }}>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button size="lg" href="/dashboard/userDetails">
              User Details
            </Button>
          </Col>
          <Col md="auto">
            <Button size="lg" href="/dashboard/addToMap">
              Add Business To Map
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
