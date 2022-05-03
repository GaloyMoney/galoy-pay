import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"

export default function Header({ link }: { link: string }) {
  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand href={link}>
          <Image src="/BBLogo.png" rounded />
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}
