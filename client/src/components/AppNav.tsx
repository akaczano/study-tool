import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function AppNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Study Tool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/terms">Terms</Nav.Link>
                    <Nav.Link href="/charts">Charts</Nav.Link>
                    <Nav.Link href="/notes">Notes</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
    ); 
}

export default AppNav;