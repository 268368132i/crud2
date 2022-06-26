import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import UserContext from './UserContext'
import React, { useContext } from 'react'
import { routesInfo } from './routeTools'
import { authModel } from './auth/libAuth'

function _MyNavbar () {
  const [userState, userDispatcher] = useContext(UserContext)

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
                        {userState._id
                            ? <NavDropdown title={userState._id ? `${userState.firstName} ${userState.lastName}` : 'Profile'} id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to={routesInfo.profile.route}>
                                    {routesInfo.profile.title}
                                </NavDropdown.Item>

                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={ async (e)=>{
                                    authModel.logout((action)=>{
                                        switch(action.action){
                                            case 'START':
                                                userDispatcher(action)
                                                return
                                            case 'FINISH':
                                                userDispatcher({
                                                    action: 'SETMANY',
                                                    value: {pending: false, error: false, _id: false}
                                                })
                                                return
                                            case 'ERROR':
                                                userDispatcher(action)
                                        }
                                    })
                                }}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            :<Nav.Link as={NavLink} to={routesInfo.login.route}>
                                {routesInfo.login.title}
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export const MyNavbar = React.memo(_MyNavbar, () => true)
