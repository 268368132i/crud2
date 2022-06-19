import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import UserContext from './UserContext'
import React, { useContext } from 'react'

function _MyNavbar () {
  const [state, dispatcher] = useContext(UserContext)

  return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        Materials&Accounting
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/auditory/all">Auditories</Nav.Link>
                        <Nav.Link as={NavLink} to="/item/all">Items</Nav.Link>
                        <NavDropdown title={state.name || 'Profile'} id="basic-nav-dropdown">
                            <NavDropdown.Item><Link to="/profile">Profile</Link></NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">My Items</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export const MyNavbar = React.memo(_MyNavbar, () => true)
