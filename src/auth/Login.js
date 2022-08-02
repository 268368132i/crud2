import React, { useContext, useEffect, useMemo, useReducer } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import UserContext from '../UserContext'
import DefaultSpinner from '../DefaultSpinner'
import { Alert } from 'react-bootstrap'
import {authModel, authReducer} from './libAuth'
import { useNavigate } from 'react-router-dom'
import { routesInfo } from '../routeTools'


export default function Login(){
    const [state, dispatcher] = useReducer(authReducer,{})
    const userDispatcher = useContext(UserContext)[1]
    const nav = useNavigate();
    const submitLogin =async (e)=>{
        e.preventDefault()
        const json = await authModel.login({
            username: state.username,
            password: state.password
        }, userDispatcher)
        if (json.authenticated) {
            console.log('Login successful')
            userDispatcher({
                action: 'login',
                value: json.user,
            })
            nav(routesInfo.home.route)
        }
    }
    // Debug
    useEffect(() => {
        console.log('Authenticatd user is:', state)
    }, [state])


    return (
        <Form
            onSubmit={submitLogin}
            style={{
                'maxWidth': '25em',
                'margin': 'auto'
            }}
        >
            <h3
                style={{
                    'marginTop': '5%',
                    'textAlign': 'center',
                    'color': '#555'

                }}
            >
                Authentication
            </h3>
            {useMemo(() => (
                <Form.Group
                    controlId="login"
                    style={{
                        'marginTop': '3%'

                    }}>
                    <Form.Label
                        style={{ 'fontSize': 'small' }}
                    >
                        Login
                    </Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Login'
                        value={state.username}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'username',
                            value: e.target.value,
                        })}
                    >
                    </Form.Control>
                </Form.Group>
            ), [state.username])
            }
            {useMemo(() => (
                <Form.Group
                    controlId='password'
                    style={{
                        'margin': '3% auto',
                    }}
                >
                    <Form.Label
                        style={{ 'fontSize': 'small' }}

                    >
                        Password
                    </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Password'
                        value={state.password}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'password',
                            value: e.target.value,
                        })}
                    ></Form.Control>
                </Form.Group>
            ), [state.password])
            }
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
            {useMemo(() => (
                <Form.Group>
                    {state.pending
                        ? <DefaultSpinner />
                        : <Button
                            type='submit'
                            style={{
                                'width': '100%',
                                'marginTop': '3%',
                            }}
                        >
                            Login
                        </Button>
                    }
                </Form.Group>
            ), [state.panding])
            }
            <p
                style={{
                    'margin': '15px auto',
                    'fontSize': 'small',
                    'textAlign': 'center'
                }}
            >
                Forgot password? Follow <a href='#'>this link</a> to recover your password.
            </p>

        </Form>
    )
}
