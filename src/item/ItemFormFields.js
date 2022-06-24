import {Model, getReducer} from '../lib/libREST'
import { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'

const locReducer = getReducer()
//Location DataModel
const locModel = new Model('location')

export default function ItemFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher


    //Reducer for a location selector
    const [locState, locDisp] = useReducer(locReducer, {})

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
                        Locationnn
                    </Form.Label>
                    <Form.Select value={state.location} onChange={e => dispatcher({
                        action: 'SET',
                        element: 'location',
                        value: e.target.value
                    })}>
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
            {state.error &&
                <Form.Group className="mb-3">
                    <Alert
                        variant='danger'
                    >
                        {String(error)}
                    </Alert>
                </Form.Group>
            }
        </>
    )
}