import {useReducer, useMemo, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import DefaultSpinner from "../DefaultSpinner";
import { getReducer, Model } from "../lib/libREST";
import ItemFormFields from "./ItemFormFields";


const reducer = getReducer()


export function ItemEditForm({ item,
    model: dataModel, listDispatcher, formFields }) {    
    console.log('Item:', item)
    //Form reducer
    const [state, dispatcher] = useReducer(reducer, item /*{
        
        name: item.name,
        model: item.model,
        inventoryNum: item.inventoryNum,
        inUseSince: item.inUseSince,
        location: (item.location || ''),
    }*/)
    //debug
    useEffect(()=>{
        console.log('form state:', state)
    },[state])
    async function onSubmit(e) {
        e.preventDefault();

        //Since 'item' is a reference all changes to it
        //will be reflected in its parent
        const updatedItem = {}
        for (const fieldName in state){
            if (fieldName === 'pending' || fieldName === 'error') continue
            updatedItem[fieldName] = state[fieldName]
        }
        console.log('Updated item:', updatedItem)
        /*item.name = state.name,
            item.model = state.model,
            item.inventoryNum = state.inventoryNum,
            item.inUseSince = state.inUseSince,
            item.location = state.location*/

        await dataModel.update(updatedItem, dispatcher)
        for (const fieldName in state){
            if (fieldName === 'pending' || fieldName === 'error') continue
            item[fieldName] = state[fieldName]
        }
        console.log('Form state before closing:', state)
        if (!state.error) {
            listDispatcher({
                action: 'closeAndUpdate',
            })
        }

    }


    return (
        <Form onSubmit={onSubmit}>
            {formFields({
                stateAndDispatcher: [state, dispatcher]
            })}
            {/*<ItemFormFields stateAndDispatcher={[state, dispatcher]} />*/}
            {state.error &&
                <Form.Group className="mb-3">
                    <Alert
                        variant='danger'
                    >
                        {String(state.error)}
                    </Alert>
                </Form.Group>
            }
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

export function ItemCreateForm({ model: dataModel, listDispatcher,
    formFields }) {

    //Form reducer
    const [state, dispatcher] = useReducer(reducer, {
        /*name: '',
        model: '',
        inventoryNum: '',
        inUseSince: '',
        location: '',*/
    })
    async function onSubmit(e) {
        e.preventDefault();
        console.log('On submit...')
        const newItem = {}
        //Since 'item' is a reference all changes to it
        //will be reflected in its parent
        for (const fieldName in state){
            if (fieldName === 'pending' || fieldName === 'error') continue
            newItem[fieldName] = state[fieldName]
        }
        console.log('New item is;', newItem)
        /*newItem.name = state.name,
            newItem.model = state.model,
            newItem.inventoryNum = state.inventoryNum,
            newItem.inUseSince = state.inUseSince,
            newItem.location = state.location*/

        const ret = await dataModel.create(newItem,
            dispatcher)
        console.log('Created successfuly')

        //'newItem' gets its '_id' inside 'create'
        listDispatcher({
            action: 'closeAndCreate',
            value: newItem
        })
    }
    return (
        <Form onSubmit={onSubmit}>
            {formFields({
                stateAndDispatcher: [state, dispatcher]
            })}
            {/*<ItemFormFields stateAndDispatcher={[state, dispatcher]} />*/}
            <Form.Group className="mb-3">
                {state.pending
                    ? <DefaultSpinner />
                    : <Button
                        type='submit'>
                        Create
                    </Button>
                }
                {state.error.message || String(state.error)}
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