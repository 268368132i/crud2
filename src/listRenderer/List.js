import Button from 'react-bootstrap/Button'
import React, { useContext, useState, useEffect, useMemo, useReducer } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import UserContext from '../UserContext'
import { getReducer } from '../lib/libREST'
import ItemEditForm from './ItemEditForm'
import ItemCreateForm from './ItemCreateForm'
import { Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'

//Custom action for a reducer
const custAction = {
  editItem : (state, action)=>{
    return {...state, editShow: true, selectedItem: action.value}
  },  
  closeAndUpdate : (state) => {
    //console.log('CloseAndUpdate', action)
    if (state.selectedItem===null) {
      return state
    }
    //listLastUpdate is updated whenever there is a change inside the list
    return {...state, editShow: false, selectedItem: null, listLastUpdate: Date.now()}
  },
  closeAndCreate : (state, action) => {
    //console.log('CloseAndCreate', action)
    const list = state.itemsList
    list.push(action.value)
    return {...state, createShow: false, itemsList: list,
      selectedItem: null, listLastUpdate: Date.now()}
  },
  cancelUpdate : (state) => {
    return {...state, editShow: false, selectedItem: null}
  },
}

const reducer = getReducer(custAction)




export function List (props) {
  //Form fields for modal forms
  const { formFields } = props

  //Renderers for items in a list
  const itemRenderers = props.itemRenderers || {
    main: (item) =>{
      return (
        <>
        {item.name}
        </>
      )
    },
    description: (item) => {
      return (
        <>
          {item.name}
        </>
      )
    }
  }

  const userState = useContext(UserContext)[0]
  const [onlyMy, setOnlyMy] = useState(false)
    
  //REST API data access model
    console.log('DataModel from props')
    const model = props.dataModel

  
  const [state, dispatcher] = useReducer(reducer,{})

  //Load items 
  useEffect(() => {
    const ac = new AbortController()
      model.getMany(dispatcher)

    return () => ac.abort()
  }, [])

  //Debug
  useEffect(()=>{
    console.log('State debug:', state)
  },[state])

  //Modal dialog for editing
  const editModal = useMemo(()=>{
    const getItem = (state) => state.itemsList[state.selectedItem]
  return (
    <>
      {state.editShow &&
        <Modal
          show={state.editShow}
          onHide={() => dispatcher({
            action: 'cancelUpdate',
          })}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Edit {itemRenderers.main(getItem(state))}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ItemEditForm
              item={state.itemsList[state.selectedItem]}
              model={model}
              listDispatcher={dispatcher}
              formFields={formFields}
              />
          </Modal.Body>
        </Modal>
      }
    </>
  )}, [state.editShow])

  // Modal dialog for deletion
  const deleteModal = useMemo(() => {
    const getItem = (state) => state.itemsList[state.selectedItem]
    return (
      <>
        {state.deleteShow &&
          <Modal
            show={state.deleteShow}
            onHide={() => dispatcher({
              action: 'SETMANY',
              value: {deleteShow: false, selectedItem: true}
            })}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Delete &quot;{itemRenderers.main(getItem(state))}&ldquo;?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-3'>
                <p>Are you sure you want to delete {getItem(state).name}{getItem(state).model ? ` (${getItem(state).model})` : ''}?</p>
                {state.deleteError &&
                <div className='mb-3'>
                  <Alert variant='danger'>
                    {state.deleteError.message || String(state.deleteError)}
                  </Alert>
                </div>
                }
                <div className='mb-3'>
                  <Button
                    variant='danger'
                    onClick={() => {
                      model.delete(state.itemsList[state.selectedItem], (a) => {
                        switch (a.action) {
                          case 'START':
                            dispatcher({
                              action: 'SETMANY',
                              value: { deletePending: true, deleteError: false }
                            })
                            break
                          case 'FINISH': {
                            const list = state.itemsList
                            list.splice(state.selectedItem,1)
                            dispatcher({
                              action: 'SETMANY',
                              value: {
                                deletePending: false, daleteError: false,
                                selectedItem: null, listLastUpdate: Date.now(),
                                deleteShow: false, itemsList: list,
                              }
                            })
                          }
                            break
                          case 'ERROR':
                            dispatcher({
                              action: 'SETMANY',
                              value: { deleteError: a.value, deletePending: false }
                            })
                            break
                        }
                      })
                    }}
                  >
                    Delete
                  </Button>
                  {' '}
                  <Button
                    variant='secondary'
                    onClick={() => {
                      dispatcher({
                        action: 'SETMANY',
                        value: { deleteShow: false, selectedItem: null }
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
      </>
    )}, [state.deleteShow])

    //Modal dialog for creation
  const createModal = useMemo(() => {
    return (
      <>
        {state.createShow &&
          <Modal
            show={state.createShow}
            onHide={() => dispatcher({
              action: 'SETMANY',
              value: {createShow: false, selectedItem: null}
            })}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Create a New Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <ItemCreateForm
              model={model}
              listDispatcher={dispatcher}
              formFields={formFields}
              />
            </Modal.Body>
          </Modal>
        }
      </>
    )}, [state.createShow])

  //List of items
  const list = useMemo(() => (
    <>
    {state.itemsList &&
    <>
      <Form.Check
        type="switch"
        label="Show only my items"
        onChange={e => {
          setOnlyMy(e.target.checked)
          //console.log('User state', userState.id)
        }}
        checked={onlyMy}
      />
      <Accordion> {
        state.itemsList.map((item, key) => {
          //console.log(`Comparing item owner: ${item.owner} with user id: ${userState.id} onlyMy ${onlyMy}`)
          if (onlyMy && item.owner !== userState.id) return null
          return (<Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{itemRenderers.main(item)}</Accordion.Header>
            <Accordion.Body>
              {itemRenderers.description(item)}
              <div>
                <Button variant="primary" style={{ margin: '5px' }} onClick={()=>{
                        /*console.log("Dispatcher (onButton):", dispatcher, "Key: ", key)
                        console.log("Dispatcher type: ", typeof dispatcher)*/
                        dispatcher({
                          action: 'editItem',
                          value: key
                        })
                }}>Edit</Button>
                <Button
                  variant="danger"
                  style={{ margin: '5px' }}
                  onClick={()=>{
                    dispatcher({
                      action: 'SETMANY',
                      value: {
                        deleteShow: true,
                        selectedItem: key
                      }
                    })
                  }}
                  >
                    Delete
                  </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          )
        })
      }
      </Accordion>
      </>
}
      </>
  ),[state.itemsList, state.listLastUpdate, onlyMy])

  useEffect(()=>{
    console.log('itemsList has changed!:', state.itemsList)
  },[state.itemsList])

  return (
    <>
      {(state.pending) &&
        <>
          <Spinner animation="border" variant="primary" />
        </>
      }
      {state.error &&
      <>
        <Alert variant='danger'>
          {`${state.error.message}`}
        </Alert>
        </>
      }
      {
        state.itemsList &&
        <>
          {createModal}
          {editModal}
          {deleteModal}
          {list}
          <Button
            className="mb-3"
            variant="primary"
            onClick={() => dispatcher({
              action: 'SETMANY',
              value: {
                createShow: true,
                selectedItem: null
              }
            })}
            style={{ margin: '10px' }}
          >
            New Item
          </Button>
        </>
      }
    </>
  )
}

List.propTypes = {
  formFields: PropTypes.func.isRequired,
  itemRenderers: PropTypes.object,
  dataModel: PropTypes.object
}