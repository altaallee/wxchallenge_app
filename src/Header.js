import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class Header extends React.Component {
    render() {
        return (
            <Navbar bg="primary" variant="dark" expand="md">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            src="wxc_logo.png"
                            height="30"
                            className="d-inline-block align-top"
                            alt="WxChallenge Logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/wxchallengegraphs">Wxchallenge Graphs</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default Header;