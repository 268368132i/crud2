import React, { useContext, useEffect, useReducer } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getReducer, Model } from '../lib/libREST'
import UserContext from '../UserContext'
import DefaultSpinner from '../DefaultSpinner'
import { Alert } from 'react-bootstrap'
import {authModel} from './libAuth'
import { useNavigate } from 'react-router-dom'
import { routesInfo } from '../routeTools'

const reducer = getReducer()

export default function Login(){
    const [state, dispatcher] = useReducer(reducer,{})
    const [user, userDispatcher] = useContext(UserContext)
    const nav = useNavigate();
    const submitLogin =async (e)=>{
        e.preventDefault()
        const json = await authModel.login({
            username: state.username,
            password: state.password
        }, dispatcher)
        if (json.authenticated) {
            console.log('Login successful')
            userDispatcher({
                action: 'SETMANY',
                value: json.user,
            })
            nav(routesInfo.home.route)
        }
    }
    useEffect(()=>{
        console.log('Authenticatd user is:', user)
    },[user])
    useEffect(()=>{
        console.log('Formnstate:', state)
    },[state])

    return (
        <Form
            onSubmit={submitLogin}
            >
            <h3
                style={{
                    'margin-top': '10%',
                    'text-align': 'center',
                    'color': '#555'

                }}
            >
                Authentication
            </h3>
            <Form.Group 
                style={{
                    'margin-top': '7%'

            }}>
                <Form.Label
                    style={{'font-size': 'small'}}
                    controlId="login"
                >
                    Login
                </Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Login'
                    value={state.username}
                    onChange={(e)=>dispatcher({
                        action: 'SET',
                        element: 'username',
                        value: e.target.value,
                    })}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group
                style={{
                    'margin-top': '3%',
                    'margin-bottom': '3%'
                }}
            >
                <Form.Label
                    style={{'font-size': 'small'}}
                    controlId='password'

                >
                    Password
                </Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Password'
                    value={state.password}
                    onChange={(e)=>dispatcher({
                        action: 'SET',
                        element: 'password',
                        value: e.target.value,
                    })}
                ></Form.Control>
            </Form.Group>
            {state.error &&
                <Form.Group
                    style={{
                    }}>
                        <Alert
                            variant='danger'
                            >
                                {String(state.error)}
                            </Alert>
                    </Form.Group>
            }
            <Form.Group>
                {state.pending
                    ?<DefaultSpinner/>
                    :<Button
                    type='submit'
                    style={{
                        'width': '100%',
                        'margin-top': '3%',
                    }}
                >
                    Login
                </Button>
                }
            </Form.Group>
            <p
                style={{
                    'margin': '15px auto',
                    'font-size': 'small',
                    'text-align': 'center'
                }}
            >
                Forgot password? Follow <a href='#'>this link</a> to recover your password.
            </p>
        </Form>
    )
}
