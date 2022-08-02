import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import UserContext from './UserContext'
import React, { useContext, useEffect, useMemo } from 'react'
import { routesInfo } from './routeTools'
import { authModel } from './auth/libAuth'
import DefaultSpinner from './DefaultSpinner'

function _MyNavbar () {
  const [userState, userDispatcher] = useContext(UserContext)

  useEffect(()=>{
      console.log('User state: ', userState)
  },[userState.authenticated])

  return (
      <>
      {useMemo(()=>(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        Materials&Accounting
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className='justify-content-end'

                    >
                    <Nav>
                        <Nav.Link as={NavLink} to="/auditory/all">Auditories</Nav.Link>
                        <Nav.Link as={NavLink} to="/item/all">Items</Nav.Link>
                        {userState.pending && 
                            <DefaultSpinner/>
                          }
                          {userState.authenticated &&
                              <NavDropdown
                                  title={userState.authenticated ? `${userState.firstName} ${userState.lastName}` : 'Profile'}
                                  id="user-dropdown"
                              >
                                  <NavDropdown.Item as={NavLink} to={routesInfo.profile.route}>
                                      {routesInfo.profile.title}
                                  </NavDropdown.Item>

                                  <NavDropdown.Divider />
                                  <NavDropdown.Item onClick={async () => {
                                      authModel.logout(userDispatcher)
                                  }}>
                                      Logout
                                  </NavDropdown.Item>
                              </NavDropdown>
                          }
                          {!(userState.authenticated || userState.pending) &&
                            <Nav.Link
                              as={NavLink}
                              to={routesInfo.login.route}
                          >
                              {routesInfo.login.title}
                          </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      ),[userState.pending, userState.authenticated])}
      </>
    )
}

export const MyNavbar = React.memo(_MyNavbar, () => false)
