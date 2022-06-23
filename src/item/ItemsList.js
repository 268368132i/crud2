import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect, useMemo, useReducer } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import UserContext from '../UserContext'
import { routesInfo as _r } from '../routeTools'
import { Model, getReducer } from '../lib/libREST'
import { ItemCreateForm, ItemEditForm } from './ItemEditForm'

//Endpoint name for accessing model's API
const endPoint = 'items'

//Custom action for a reducer
const custAction = {
  editItem : (state, action)=>{
    return {...state, editShow: true, selectedItem: action.value}
  },  
  closeAndUpdate : (state, action) => {
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
  cancelUpdate : (state, action) => {
    return {...state, editShow: false, selectedItem: null}
  },
}

const reducer = getReducer(custAction)




export function ItemsList (props) {
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

  const [userState, userDispatcher] = useContext(UserContext)
  const [onlyMy, setOnlyMy] = useState(false)
  
  //Path bar is set here
  const [path, setPath] = props.path
  useEffect(() => {
    setPath([
      { route: _r.home.route, name: _r.home.title },
      { route: _r.items_all.route, name: _r.items_all.title, isActive: true }
    ])
  }, [])
  
  //REST API data access model
  let model
  console.log('props.dataModel type:', typeof props.dataModel)
  if (typeof props.dataModel === 'undefined') {
    console.log('New DataModel')
    model = new Model(endPoint)
  } else {
    console.log('DataModel from props')
    model = props.dataModel
  }
  
  const [state, dispatcher] = useReducer(reducer,{})
  
  //Will be removed soon
  const nav = useNavigate()

  //Load items 
  useEffect(() => {
    const ac = new AbortController()
      model.getMany(dispatcher)

    return () => ac.abort()
  }, [])

  //Debug
  useEffect(()=>{
    console.log('State debug:', state)
  },[state.listLastUpdate])

  //Modal dialog for editing
  const editModal = useMemo(()=>{
    const getItem = (state) => state.itemsList[state.selectedItem]
  return (
    <>
      {state.editShow &&
        <Modal
          show={state.editShow}
          onHide={(e) => dispatcher({
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

  //Modal dialog for deletion
  const deleteModal = useMemo(() => {
    const getItem = (state) => state.itemsList[state.selectedItem]
    return (
      <>
        {state.deleteShow &&
          <Modal
            show={state.deleteShow}
            onHide={(e) => dispatcher({
              action: 'SETMANY',
              value: {deleteShow: false, selectedItem: true}
            })}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Delete "{itemRenderers.main(getItem(state))}"?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-3'>
                <p>Are you sure you want to delete {getItem(state).name}{getItem(state).model ? ` (${getItem(state).model})` : ''}?</p>
                <div className='mb-3'>
                  <Button
                    variant='danger'
                    onClick={(e) => {
                      model.delete(state.itemsList[state.selectedItem], (a) => {
                        switch (a.action) {
                          case 'START':
                            dispatcher({
                              action: 'SETMANY',
                              value: { deletePending: true, deleteError: false }
                            })
                            break
                          case 'FINISH':
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
                    onClick={(e) => {
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
            onHide={(e) => dispatcher({
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
                <Button variant="primary" style={{ margin: '5px' }} onClick={(e)=>{
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
                  onClick={(e)=>{
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
    {(state.pending || !state.itemsList) &&
    <>
    <Spinner animation="border" variant="primary" />
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
      onClick={(e) => dispatcher({
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
