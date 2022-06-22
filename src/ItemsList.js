import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect, useMemo, useReducer } from 'react'
import Accordion from 'react-bootstrap/Accordion'

import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import UserContext from './UserContext'
import { routesInfo as _r } from './routeTools'
import { Model, getReducer } from './libREST'
import { ItemCreateForm, ItemEditForm } from './ItemEditForm'

//Endpoint name for accessing model's API
const endPoint = 'items'

//Custom action for a reducer
let custAction = new Array()
custAction['editItem'] = (state, action)=>{
  return {...state, editShow: true, selectedItem: action.value}
}

custAction['closeAndUpdate'] = (state, action) => {
  //console.log('CloseAndUpdate', action)
  if (state.selectedItem===null) {
    return state
  }
  //listLastUpdate is updated whenever there is a change inside the list
  return {...state, editShow: false, selectedItem: null, listLastUpdate: Date.now()}
}
custAction['closeAndCreate'] = (state, action) => {
  //console.log('CloseAndCreate', action)
  const list = state[endPoint + 'List']
  list.push(action.value)
  return {...state, createShow: false, itemList: list,
    selectedItem: null, listLastUpdate: Date.now()}
}
custAction['cancelUpdate'] = (state, action) => {
  return {...state, editShow: false, selectedItem: null}
}
const reducer = getReducer(custAction)




export function ItemsList (props) {
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
  const model = new Model(endPoint)

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

  //Called when a modal is cancelled
  function onCancellModal(){
    dispatcher
  }
  //Modal dialog for editing
  const editModal = useMemo(()=>(
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
              Edit Item
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ItemEditForm
              item={state[endPoint + 'List'][state.selectedItem]}
              model={model}
              listDispatcher={dispatcher}
              />
          </Modal.Body>
        </Modal>
      }
    </>
  ), [state.editShow])

  //Modal dialog for deletion
  const deleteModal = useMemo(() => {
    const getItem = (state) => state[endPoint + 'List'][state.selectedItem]
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
                Delete {getItem(state).name}?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-3'>
                <p>Are you sure you want to delete {getItem(state).name} ({getItem(state).model})?</p>
                <div className='mb-3'>
                  <Button
                    variant='danger'
                    onClick={(e) => {
                      model.delete(state[endPoint + 'List'][state.selectedItem], (a) => {
                        switch (a.action) {
                          case 'START':
                            dispatcher({
                              action: 'SETMANY',
                              value: { deletePending: true, deleteError: false }
                            })
                            break
                          case 'FINISH':
                            const list = state[endPoint + 'List']
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
              />
            </Modal.Body>
          </Modal>
        }
      </>
    )}, [state.createShow])

  //List of items
  const list = useMemo(() => (
    <>
    {state[endPoint + 'List'] &&
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
        state[endPoint + 'List'].map((item, key) => {
          //console.log(`Comparing item owner: ${item.owner} with user id: ${userState.id} onlyMy ${onlyMy}`)
          if (onlyMy && item.owner !== userState.id) return null
          return (<Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{item.name}</Accordion.Header>
            <Accordion.Body>
              <h3>{item.name}</h3>
              <p>{item.model}</p>
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
  ),[state[endPoint + 'List'], state.listLastUpdate, onlyMy])

  useEffect(()=>{
    console.log('itemsList has changed!:', state.itemsList)
  },[state.itemsList])

  return (
    <>
    {(state.pending || !state[endPoint + 'List']) &&
    <>
    <Spinner animation="border" variant="primary" />
    </>
  }
  {
    state[endPoint + 'List'] &&
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
