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
import { ItemEditForm } from './ItemEditForm'

//Endpoint name for accessing model's API
const endPoint = 'items'
//Custom action for a reducer
let custAction = new Array()
custAction['editItem'] = (state, action)=>{
  return {...state, show: true, selectedItem: action.value}
}
custAction['closeAndUpdate'] = (state, action) => {
  if (state.selectedItem===null) {
    return state
  }
  const newList = [...state[endPoint + 'List']]
  newList[state.selectedItem] = action.value
  console.log('New items list: ', newList)
  return {...state, show: false, selectedItem: null, itemsList: newList}
}
custAction['cancelUpdate'] = (state, action) => {
  return {...state, show: false, selectedItem: null}
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

  //Called when a modal is cancelled
  function onCancellModal(){
    dispatcher
  }
  //Modal dialog for editing
  const editModal = useMemo(()=>(
    <>
      {state.show &&
        <Modal
          show={state.show}
          onHide={(e) => dispatcher({
            action: 'SET',
            element: 'show',
            value: false
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
          {console.log('State in modal:', state)}
        </Modal>
      }
    </>
  ),[state.show])

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
          console.log('User state', userState.id)
        }}
        checked={onlyMy}
      />
      <Accordion> {
        state[endPoint + 'List'].map((item, key) => {
          console.log(`Comparing item owner: ${item.owner} with user id: ${userState.id} onlyMy ${onlyMy}`)
          if (onlyMy && item.owner !== userState.id) return null
          return (<Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{item.name}</Accordion.Header>
            <Accordion.Body>
              <h3>{item.name}</h3>
              <p>{item.model}</p>
              <div>
                <Button variant="primary" style={{ margin: '5px' }} onClick={(e)=>{
                        console.log("Dispatcher (onButton):", dispatcher, "Key: ", key)
                        console.log("Dispatcher type: ", typeof dispatcher)
                        dispatcher({
                          action: 'editItem',
                          value: key
                        })
                }}>Edit</Button>
                <Button variant="danger" style={{ margin: '5px' }}>Delete</Button>
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
  ),[state[endPoint + 'List'], onlyMy])

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
    {editModal}
    {list}
    <Button 
      className="mb-3" 
      variant="primary" 
      onClick={() => nav('/item/new')} 
      style={{ margin: '10px' }}
      >
        New Item
    </Button>
    </>
}
</>
  )
}
