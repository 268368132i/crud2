import { Model, getReducer } from '../lib/libREST'
import React, { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import DefaultSpinner from '../DefaultSpinner'
import PropTypes from 'prop-types'

const groupReducer = getReducer()
const groupModel = new Model('group')

export default function UserFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher

    const [groupState, groupDispatcher] = useReducer(groupReducer, {})

    //Load groups
    useEffect(() => {
        const ac = new AbortController()

        groupModel.getMany(groupDispatcher)

        return ac.abort()
    }, [])

    //Debug
    useEffect(() => {
        console.log('Groups changed: ', state.groups)
    }, [state.groups])


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
            {useMemo(() => (
                <Form.Group className="mb-3" key='password'>
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control
                        type='password'
                        value={state.password}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'password',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.password])}
            {useMemo(() => (

                <h5>Group assignment</h5>
            ), [])}
            {useMemo(() => {
                return (
                    <>
                        <ListGroup>
                            {console.log('State in userfields:', state)}
                            {state.groups &&
                                state.groups.map((group) => (
                                    <ListGroup.Item key={group._id}>
                                        {group.name}
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                        <Form.Select
                            value={state.selected || 0}
                            htmlSize={2}
                            defaultValue={state.groups && state.groups[0]}
                            onChange={(e) => {
                                console.log('Selected value: ', e.target.value)
                                dispatcher({
                                    action: 'SET',
                                    element: 'selected',
                                    value: e.target.value
                                })
                            }}
                        >
                            {state.groups &&
                                state.groups.map((item, index) => (
                                    <option key={item._id} value={index}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </Form.Select>
                    </>
                )
            }, [state.groups, state.selected])}
            {useMemo(() => {
                return (
                    <>
                        <div>
                            <Button
                                className='m-2'
                                onClick={(e) => {
                                    console.log('Groups available; ', groupState.itemsList, ' selected index: ', groupState.selected)
                                    console.log('Group state: ', groupState)
                                    console.log('Group selected: ', groupState.selected)
                                    dispatcher({
                                        action: 'SET',
                                        element: 'groups',
                                        value: [...state.groups || [], groupState.itemsList[groupState.selected]]
                                    })
                                }}
                            >
                                Assign
                            </Button>
                            <Button
                                className='m-2'
                                onClick={(e) => {
                                    console.log(`Deassigning at index ${state.selected}`)
                                    state.groups.splice(state.selected, 1)
                                    console.log('Resulying groups: ', state.groups)
                                    dispatcher({
                                        action: 'SETMANY',
                                        value: {
                                            groups: [...state.groups],
                                            selected: false
                                    }})
                                }}
                            >
                                Deassign
                            </Button>
                        </div>
                        {groupState.pending && <DefaultSpinner />}
                        {groupState.error &&
                            <Alert variant='danger'>
                                {String(groupState.error)}
                            </Alert>
                        }
                        {(!groupState.pending && groupState.itemsList) &&
                            <Form.Select
                                value={groupState.group}
                                htmlSize={2}
                                defaultValue={groupState.itemList && groupState.itemList[0]}
                                onChange={(e) => {
                                    console.log('Selected value: ', e.target.value)
                                    groupDispatcher({
                                        action: 'SET',
                                        element: 'selected',
                                        value: e.target.value
                                    })
                                }}
                            >
                                {groupState.itemsList &&
                                    groupState.itemsList.map((item, index) => {
                                        if (state.groups && state.groups.findIndex(group => {
                                            return group._id === item._id
                                        }) > -1) {
                                            return 
                                        }
                                        return (
                                            <option key={item._id} value={index}>
                                                {item.name}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Select>
                        }
                    </>
                )
            }, [groupState, state.groups, state.selected])}
        </>
    )
}

UserFormFields.propTypes = {
    stateAndDispatcher: PropTypes.array.isRequired
}