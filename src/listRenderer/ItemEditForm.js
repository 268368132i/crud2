import React, {useReducer, useMemo, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import DefaultSpinner from "../DefaultSpinner";
import { getReducer } from "../lib/libREST";
import PropTypes from 'prop-types'

const reducer = getReducer()

export default function ItemEditForm({ item,
    model: dataModel, listDispatcher, formFields }) {    
    console.log('Edit Form: Item:', item)
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
        console.log('Edit form: form state:', state)
    },[state])
    async function onSubmit(e) {
        e.preventDefault();

        // Since 'item' is a reference all changes to it
        // will be reflected in its parent
        const updatedItem = {}
        for (const fieldName in state){
            if (fieldName === 'pending' || fieldName === 'error') continue
            updatedItem[fieldName] = state[fieldName]
        }
        console.log('Updated item:', updatedItem)
        // Updating item values in db
        if (await dataModel.update(updatedItem, dispatcher)) {
            // Setting item values
            for (const fieldName in state) {
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
                        {state.error.message || String(state.error)}
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
                        onClick={() => {
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

ItemEditForm.propTypes = {
    item: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    listDispatcher: PropTypes.func.isRequired,
    formFields: PropTypes.func.isRequired
}

