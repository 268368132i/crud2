import {Model, getReducer} from '../lib/libREST'
import { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'

const locReducer = getReducer()

export default function UserFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher


    return (
        <>
            {useMemo(() => (
                <Form.Group className="mb-3" key='firstName'>
                    <Form.Label>
                        First Name
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.firstName}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'firstName',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.firstName])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='lastName'>
                    <Form.Label>
                        Last Name
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.lastName}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'lastName',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.lastName])}
                        {useMemo(() => (
                <Form.Group className="mb-3" key='username'>
                    <Form.Label>
                        Login
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.username}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'username',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.username])}
        </>
    )
}