import React, { useReducer } from 'react'
import Form from 'react-bootstrap/Form'
import { getReducer } from '../lib/libREST'
import UserFormFields from '../user/UserFormFields'

const reducer = getReducer

export default function Profile() {

const [formState, formDispatcher] = useReducer(reducer, {})

    return (
        <Form>
            <UserFormFields
                stateAndDispatcher = {[formState, formDispatcher]}
            />
        </Form>
    )
}