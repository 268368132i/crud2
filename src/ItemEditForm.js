import { useReducer, useMemo, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DefaultSpinner from "./DefaultSpinner";
import { getReducer, Model } from "./libREST";
import { Alert } from "bootstrap";


const reducer = getReducer()
const locReducer = getReducer()

export function ItemFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher


    //Reducer for a location selector
    const [locState, locDisp] = useReducer(locReducer, {})
    //Location DataModel
    const locModel = new Model('location')

    useEffect(() => {
        locModel.getMany(locDisp)
    }, [])

    //Form fields are stored in an array
    const fields = new Array()

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
                        Location
                    </Form.Label>
                    <Form.Select value={state.location} onChange={e => dispatcher({
                        action: 'SET',
                        element: 'location',
                        value: e.target.value
                    })}>
                        {locState.pending &&
                            <DefaultSpinner />
                        }
                        {locState.locationList && locState.locationList.map(a => {
                            return (
                                <option key={a._id} value={a._id}>{`${a.building} / ${a.name}`}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
            ), [state.location, locState.locationList])}
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

export function ItemEditForm({ item,
    model: dataModel, listDispatcher }) {

    //Form reducer
    const [state, dispatcher] = useReducer(reducer, {
        name: item.name,
        model: item.model,
        inventoryNum: item.inventoryNum,
        inUseSince: item.inUseSince,
        location: (item.location || ''),
    })





    async function onSubmit(e) {
        e.preventDefault();

        //Since 'item' is a reference all changes to it
        //will be reflected in its parent
        item.name = state.name,
            item.model = state.model,
            item.inventoryNum = state.inventoryNum,
            item.inUseSince = state.inUseSince,
            item.location = state.location

        await dataModel.update({
            _id: item._id,
            name: state.name,
            model: state.model,
            inventoryNum: state.inventoryNum,
            inUseSince: state.inUseSince,
            location: state.location,
        }, dispatcher)
        listDispatcher({
            action: 'closeAndUpdate',
        })

    }


    return (
        <Form onSubmit={onSubmit}>
            <ItemFormFields stateAndDispatcher={[state, dispatcher]} />
            {useMemo(() => (
                <Form.Group className="mb-3">
                    {state.pending
                        ? <DefaultSpinner />
                        : <Button
                            type='submit'>
                            Save changes
                        </Button>
                    }
                    {' '}
                    <Button
                        variant='secondary'
                        onClick={(e) => {
                            listDispatcher({
                                action: 'cancelUpdate'
                            })
                        }}
                    >
                        Cancel
                    </Button>
                </Form.Group>
            ), [])}

        </Form>
    )
}

export function ItemCreateForm({ model: dataModel, listDispatcher }) {

    //Form reducer
    const [state, dispatcher] = useReducer(reducer, {
        name: '',
        model: '',
        inventoryNum: '',
        inUseSince: '',
        location: '',
    })





    async function onSubmit(e) {
        e.preventDefault();

        const newItem = {}
        //Since 'item' is a reference all changes to it
        //will be reflected in its parent
        newItem.name = state.name,
            newItem.model = state.model,
            newItem.inventoryNum = state.inventoryNum,
            newItem.inUseSince = state.inUseSince,
            newItem.location = state.location



        const ret = await dataModel.create(newItem,
            dispatcher)
        console.log('Created successfuly')

        //'newItem' should get its '_id' inside 'create'
        listDispatcher({
            action: 'closeAndCreate',
            value: newItem
        })
    }

    return (
        <Form onSubmit={onSubmit}>
            <ItemFormFields stateAndDispatcher={[state, dispatcher]} />
            <Form.Group className="mb-3">
                {state.pending
                    ? <DefaultSpinner />
                    : <Button
                        type='submit'>
                        Create
                    </Button>
                }
                {' '}
                <Button
                    variant='secondary'
                    onClick={(e) => {
                        listDispatcher({
                            action: 'SETMANY',
                            value: { createShow: false, selectedItem: null }
                        })
                    }}
                >
                    Cancel
                </Button>
            </Form.Group>

        </Form>
    )
}