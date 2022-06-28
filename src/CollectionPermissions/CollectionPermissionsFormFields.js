import {Model, getReducer} from '../lib/libREST'
import { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import PermissionsChooser from './PermissionsChooser'

const reducer = getReducer()
const groupModel = new Model('group')


export default function CollectionPermissionsFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher

    const [groupState, groupDispatcher] = useReducer(reducer, {})

    const [colState, colDispatcher] = useReducer(reducer, {})

    //Load groups
    useEffect(() => {
        const ac = new AbortController()

        groupModel.getMany(groupDispatcher)

        return ac.abort()
    }, [])


    return (
        <>
            {useMemo(()=>(
                <Form.Group>
                <Form.Label>
                    Collection name
                </Form.Label>
                <Form.Control
                    type='text'
                    value={state.collection}
                    onChange={(e)=> dispatcher({
                        action: 'SET',
                        element: 'collection',
                        value: e.target.value
                    })}
                    />
                    </Form.Group>
            ),[state.collection])}
            {useMemo(() => (
                <Form.Group>
                    <Form.Label>
                        Choose what group this collection belongs to
                    </Form.Label>
                <Form.Select
                    value={state.group._id}
                    onChange={(e) => {
                        console.log('Selected value: ', e.target.value)
                        dispatcher({
                            action: 'SET',
                            element: 'group',
                            value: {...state.group || {}, _id: e.target.value}
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
                        groupState.itemsList.map((item, index) => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))
                    }
                </Form.Select>
                </Form.Group>
            ), [groupState.itemsList, state.group])}
            {useMemo(()=>(
                <Form.Group>
                    <Form.Label>
                        Anonymous users
                    </Form.Label>
                    <PermissionsChooser
                    state={[state, dispatcher]}
                    element='all'
                    />
                 </Form.Group>
            ),[state])}
            {useMemo(()=>(
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
            ),[state.group, groupState])}
        </>
    )
}