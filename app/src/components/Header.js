import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function Header() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="https://bitcoinbeach.com">
          <Image src={process.env.PUBLIC_URL + "/BBLogo.png"} rounded />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/dashboard">Home</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
