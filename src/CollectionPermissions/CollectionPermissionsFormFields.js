import { Model, getReducer } from '../lib/libREST'
import React, { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import PermissionsChooser from './PermissionsChooser'
import ListGroup from 'react-bootstrap/ListGroup'
import Alert from 'react-bootstrap/Alert'
import DefaultSpinner from '../DefaultSpinner'
import PropTypes from 'prop-types'

const reducer = getReducer()
const groupModel = new Model('group')


export default function CollectionPermissionsFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher

    const [groupState, groupDispatcher] = useReducer(reducer, {})

    //Load groups
    useEffect(() => {
        const ac = new AbortController()

        groupModel.getMany(groupDispatcher)

        return ac.abort()
    }, [])


    return (
        <>
                    {useMemo(() => (
                        <Form.Group>
                            <Form.Label>
                                Collection name
                            </Form.Label>
                            <Form.Control
                                type='text'
                                value={state.collection}
                                onChange={(e) => dispatcher({
                                    action: 'SET',
                                    element: 'collection',
                                    value: e.target.value
                                })}
                                />
                        </Form.Group>
                    ), [state.collection])}
                    <div className='mt-3 mb-2'>
                <ListGroup>
                    <ListGroup.Item>
                        {useMemo(() => (
                            <Form.Group>
                                <Form.Label>
                                    Anonymous users
                                </Form.Label>
                                <PermissionsChooser
                                    state={[state, dispatcher]}
                                    element='all'
                                />
                            </Form.Group>
                        ), [state])}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        {useMemo(() => (
                            <Form.Group>
                                <Form.Label>
                                    Group and group permissions
                                </Form.Label>
                                <Form.Select
                                    value={state.group?._id || null}
                                    onChange={(e) => {
                                        console.log('Selected value: ', e.target.value)
                                        dispatcher({
                                            action: 'SET',
                                            element: 'group',
                                            value: { ...state.group || {}, _id: e.target.value }
                                        })
                                    }}
                                >
                                    {groupState.pending && <DefaultSpinner />}
                                    {groupState.error &&
                                        <Alert variant='danger'>
                                            {String(groupState.error)}
                                        </Alert>
                                    }
                                    {groupState.itemsList &&
                                        groupState.itemsList.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                        ), [groupState.itemsList, state.group])}

                        {useMemo(() => (
                            <Form.Group>
                                {groupState.itemsList &&
                                    <Form.Label>
                                        {state.group
                                            ? state.group.name
                                            : groupState.itemsList[groupState.selected || 0].name
                                        } users
                                    </Form.Label>}
                                <PermissionsChooser
                                    state={[state, dispatcher]}
                                    element='group'
                                />
                            </Form.Group>
                        ), [state.group, groupState])}
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </>
    )
}

CollectionPermissionsFormFields.propTypes = {
    stateAndDispatcher: PropTypes.array
}