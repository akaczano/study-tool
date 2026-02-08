import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';


function AppNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Study Tool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/terms" className="nav-link">Terms</NavLink>
                    <NavLink to="/charts" className="nav-link">Charts</NavLink>
                    <NavLink to="/notes" className="nav-link">Notes</NavLink>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
    ); 
}

export default AppNav;