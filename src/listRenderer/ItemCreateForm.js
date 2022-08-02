import React, { useReducer } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import DefaultSpinner from "../DefaultSpinner";
import { getReducer } from "../lib/libREST";
import PropTypes from 'prop-types'

const reducer = getReducer()

export default function ItemCreateForm({ model: dataModel, listDispatcher,
  formFields }) {

  //Form reducer
  //TODO Insert initial values to avoid errors about uncontrolled elements
  const [state, dispatcher] = useReducer(reducer, {})
  async function onSubmit(e) {
      e.preventDefault();
      console.log('On submit...')
      const newItem = {}
      /*
      Since 'item' is a reference, all changes to it
      will be reflected in its parent
      */
      for (const fieldName in state){
          if (fieldName === 'pending' || fieldName === 'error') continue
          newItem[fieldName] = state[fieldName]
      }
      console.log('New item is;', newItem)

      //'create' returns 'true' on success
      if (await dataModel.create(newItem, dispatcher)) {
          console.log('Created successfuly')

          //'newItem' gets its '_id' inside 'create'
          listDispatcher({
              action: 'closeAndCreate',
              value: newItem
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
              <Alert variant='danger'>
                  {state.error.message || String(state.error)}
              </Alert>
          }
          <Form.Group className="mb-3">
              {state.pending
                  ? <DefaultSpinner />
                  : <Button
                      type='submit'>
                      Create
                  </Button>
              }
              {/*state.error.message || String(state.error)*/}
              {' '}
              <Button
                  variant='secondary'
                  onClick={() => {
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

ItemCreateForm.propTypes = {
  item: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  listDispatcher: PropTypes.func.isRequired,
  formFields: PropTypes.element.isRequired
}