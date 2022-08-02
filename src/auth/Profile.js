import React, { useReducer, useContext, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import UserFormFields from '../user/UserFormFields'
import UserContext from '../UserContext'
import { authModel, authReducer } from './libAuth'

const submitProfile = async (formState, formDispatcher, contextDispatcher) => {
    const user = {
        _id: formState._id,
        username: formState.username,
        firstName: formState.firstName,
        lastName: formState.lastName,
        groups: formState.groups
    }
    if (await authModel.update(user, formDispatcher)) {
        contextDispatcher({
            action: 'SETMANY',
            value: user
        })
    }
}


export default function Profile() {

    const [userState, userDispatcher] = useContext(UserContext)

    const [formState, formDispatcher] = useReducer(authReducer, {
        username: userState.username,
        lastName: userState.lastName,
        firstName: userState.firstName,
        groups: [...userState.groups || []],
    })

    // Debug
    useEffect(() => {
        console.log('Profile fields changed: ', formState)
    }, [formState])
    // Update form fields on global user context change
    useEffect(() => {
        formDispatcher({
            action: 'SETMANY',
            value: { ...userState, groups: [...userState.groups || []] }
        })
    }, [userState])



    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                submitProfile(formState, formDispatcher, userDispatcher)
            }}
        >
            <UserFormFields
                stateAndDispatcher={[formState, formDispatcher]}
            />
            <Form.Group
                className='mt-3'
            >
                <Button
                    type='submit'
                    disabled={formState.pending}
                >
                    {formState.pending
                    ? 'Saving...'
                    : 'Save'
                    }
                </Button>
            </Form.Group>
        </Form>
    )
}