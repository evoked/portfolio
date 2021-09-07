import React from 'react'
import "../styling/header.scss"
import { Link } from 'react-scroll'
import { Navbar, Container, Nav } from 'react-bootstrap'

export const Header = () => {
    return (
        <div className="header">
            <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">
                        <Link activeClass="active" className="scroll-projects" to="projects" spy={true} smooth={true} duration={500}>Link</Link>
                    </Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>

            <p className="text">blah</p>
        </div>
    )
}
