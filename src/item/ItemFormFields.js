import {Model, getReducer} from '../lib/libREST'
import React, { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import PermissionsChooser from '../CollectionPermissions/PermissionsChooser'
import { ListGroup, Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types'
import DefaultSpinner from '../DefaultSpinner'
import Alert from 'react-bootstrap/Alert'

const locReducer = getReducer()
//Location DataModel
const locModel = new Model('location')

export default function ItemFormFields(props) {
    console.log('Item Form Fields')
    const [state, dispatcher] = props.stateAndDispatcher

    // Reducer for a location selector
    const [locState, locDisp] = useReducer(locReducer, {})

    // State for a group selector
    const [groupState, groupDispatcher] = useReducer(getReducer(), {})

    // Load groups
    useEffect(() => {
        const ac = new AbortController()
        const groupModel = new Model('group')
        groupModel.getMany(groupDispatcher)
        return ac.abort()
    }, [])

    useEffect(() => {
        console.log('Getting locations for modal')
        locModel.getMany(locDisp)
    }, [])
    useEffect(()=>{
        console.log('LocState:', locState)
    },[locState])

    console.log('LocState_:', locState)

    return (
        <>
        <Tabs
            defaultActiveKey='general'
            >
                <Tab
                    eventKey='general'
                    title='General'
                >
            {useMemo(() => (
                <Form.Group className="mb-3" key='name'>
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.name}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'name',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.name])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='model'>
                    <Form.Label>
                        Model
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.model}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'model',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.model])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='inventoryNum'>
                    <Form.Label>
                        Inventory Number
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.inventoryNum}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'inventoryNum',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.inventoryNum])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='inUseSince'>
                    <Form.Label>
                        In Use Since
                    </Form.Label>
                    <Form.Control
                        type='date'
                        value={state.inUseSince}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'inUseSince',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.inUseSince])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='location'>
                    <Form.Label>
                        Location
                    </Form.Label>
                    <Form.Select value={state.location} onChange={e => dispatcher(
                        {
                        action: 'SET',
                        element: 'location',
                        value: e.target.value || ''
                        }
                    )}>
                        {locState.pending &&
                            <DefaultSpinner />
                        }
                        {locState.itemsList && locState.itemsList.map(a => {
                            return (
                                <option key={a._id} value={a._id}>{`${a.building} / ${a.name}`}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                    ), [state.location, locState.itemsList])}
            </Tab>
              <Tab
                eventKey='permissions'
                title='Permissions'
                >
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
                        ), [state.all])}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Form.Group className='mt-2 mb-2'>
                                    <Form.Label>
                                        Group and group permissions
                                    </Form.Label>
                                    {useMemo(() => (
                                        <Form.Select
                                            value={state.group?._id || ''}
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
                                        
                                        ), [groupState.itemsList, state.group])}
                                    {useMemo(() => (
                                        <PermissionsChooser
                                            state={[state, dispatcher]}
                                            element='group'
                                        />
                                    ), [state.group, groupState])}
                                </Form.Group>
                            </ListGroup.Item>
                        </ListGroup>
            </Tab>
            </Tabs>
{/*             {state.error &&
                <Form.Group className="mb-3">
                    <Alert
                        variant='danger'
                    >
                        {String(error)}
                    </Alert>
                </Form.Group>
            } */}
        </>
    )
}

ItemFormFields.propTypes = {
    stateAndDispatcher: PropTypes.array.isRequired
}