import {Model, getReducer} from '../lib/libREST'
import { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DefaultSpinner from '../DefaultSpinner'

const groupReducer = getReducer()
const groupModel = new Model('group')

export default function UserFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher

    const [groupState, groupDispatcher] = useReducer(groupReducer,{})

    //Load groups
    useEffect(()=>{
        const ac = new AbortController()

        groupModel.getMany(groupDispatcher)

        return ac.abort()
    },[])


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
            {useMemo(()=>(

                <h5>Group assignment</h5>
            ),[])}
            {useMemo(()=>{
                return (
                    <ListGroup>
                        {console.log('State in userfields:', state)}
                        {state.groups && 
                        state.groups.map((group)=>(
                        <ListGroup.Item key={group._id}>
                            {group.name}
                        </ListGroup.Item>
                        ))
                        }
                    </ListGroup>
                )
            },[state.groups])}
            {useMemo(()=>{
                return (
                    <>
                    <Button
                        onClick={(e)=>{
                            console.log('Groups available; ', groupState.itemsList, ' selected index: ', groupState.selected)
                            console.log('Group state: ', groupState)
                            dispatcher({
                                action: 'SET',
                                element: 'groups',
                                value: [...state.groups || [], groupState.itemsList[groupState.selected]]
                            })
                        }}
                    >
                        Assign
                    </Button>
                    <Form.Select
                        value={groupState.group}
                        onChange={(e)=>{
                            console.log('Selected value: ', e.target.value)
                            groupDispatcher({
                            action: 'SET',
                            element: 'selected',
                            value: e.target.value
                        })}}
                    >
                        {groupState.pending && <DefaultSpinner/>}
                        {groupState.error && 
                            <Alert variant='danger'>
                            {String(groupState.error)}
                            </Alert>
                        }
                        {groupState.itemsList &&
                            groupState.itemsList.map((item, index)=>(
                                <option key={item._id} value={index}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </Form.Select>
                    </>
                )
            },[groupState, state.groups])}
        </>
    )
}