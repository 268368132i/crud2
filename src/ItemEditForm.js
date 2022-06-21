import { useReducer, useMemo, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DefaultSpinner from "./DefaultSpinner";
import { getReducer, Model } from "./libREST";
import { Alert } from "bootstrap";

export function ItemEditForm({item, 
    model: dataModel, listDispatcher}){

    //Form reducer
    const [state, dispatcher] = useReducer(getReducer(),{
        name: item.name,
        model: item.model,
        inventoryNum: item.inventoryNum,
        inUseSince: item.inUseSince,
        location: item.location,
    })

    //Location reducer
    const [locState, locDisp] = useReducer(getReducer(),{})
    //Location DataModel
    const locModel = new Model('location')

    useEffect(()=>{
        locModel.getMany(locDisp)
    },[])


    //Add fields into an array
    const fields = new Array()
    {
    fields.push(useMemo(() => (
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
    ), [state.name]))
    fields.push(useMemo(() => (
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
    ), [state.model]))
    fields.push(useMemo(() => (
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
    ), [state.inventoryNum]))
    fields.push(useMemo(() => (
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
    ), [state.inUseSince]))
    fields.push(useMemo(() => (
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
                    <DefaultSpinner/>
                }
                {locState.locationList && locState.locationList.map(a => {
                    return (
                        <option key={a._id} value={a._id}>{`${a.building} / ${a.name}`}</option>
                    )
                })}
            </Form.Select>
        </Form.Group>
    ), [state.location, locState.locationList]))
    }

    function onSubmit(e){
        e.preventDefault();
        const newItem = {
            _id: item._id,
            name: state.name,
            model: state.model,
            inventoryNum: state.inventoryNum,
            inUseSince: state.inUseSince,
            location: state.location,
        }
        console.log('New item:', newItem)
        dataModel.update(newItem, dispatcher, ()=>{
            if (typeof success === 'function'){
                //success(newItem)
                console.log(typeof listDispatcher)
                listDispatcher({
                    action: 'closeAndUpdate',
                    value: newItem
                })
            }
        })
    }

    return (
        <Form onSubmit={onSubmit}>
            {fields.map((field, key)=>(
                <>
                {field}
                </>
            ))}
            {state.error &&
                <Form.Group className="mb-3">
                    <Alert
                        variant='danger'
                        >
                        {String(error)}
                    </Alert>
                </Form.Group>
            }
            <Form.Group className="mb-3">
            {state.pending 
            ? <DefaultSpinner/>
            : <Button
                type='submit'>
                    Save changes
            </Button>
            }
            {' '}
            <Button
                variant='secondary'
                onClick={(e)=>{
                    listDispatcher({
                        action: 'cancelUpdate'
                    })
                }}
            >
                Cancel
            </Button>
            </Form.Group>

        </Form>
    )
}