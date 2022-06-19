import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { useContext, useState, useEffect, useReducer } from 'react'
import Accordion from 'react-bootstrap/Accordion'

import { dataStateToReducer, errorStateToReducer, getAndSetItems, pendingStateToReducer, reducer } from './libitem'
import Spinner from 'react-bootstrap/Spinner'
import { Form } from 'react-bootstrap'
import UserContext from './UserContext'
import { routesInfo as _r } from './routeTools'

export function ItemsList (props) {
  const [userState, userDispatcher] = useContext(UserContext)
  const [onlyMy, setOnlyMy] = useState(false)
  const [path, setPath] = props.path
  useEffect(() => {
    setPath([
      { route: _r.home.route, name: _r.home.title },
      { route: _r.items_all.route, name: _r.items_all.title, isActive: true }
    ])
  }, [])

  const [state, dispatcher] = useReducer(reducer, {})
  const nav = useNavigate()
  useEffect(() => {
    const ac = new AbortController()

    getAndSetItems(dataStateToReducer(dispatcher),
      errorStateToReducer(dispatcher),
      pendingStateToReducer(dispatcher))

    return () => ac.abort()
  }, [])
  useEffect(() => {
    console.log(onlyMy)
  }, [onlyMy])

  // if (state.data){
  return (
        <>
        {(state.pending || !state.data) &&
        <>
            <Spinner animation="border" variant="primary" />
        </>
        }
    {
    state.data &&
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
        state.data.map((item, key) => {
          console.log(`Comparing item owner: ${item.owner} with user id: ${userState.id} onlyMy ${onlyMy}`)
          if (onlyMy && item.owner !== userState.id) return null
          return (<Accordion.Item key={key} eventKey={key}>
                    <Accordion.Header>{item.name}</Accordion.Header>
                    <Accordion.Body>
                        <h3>{item.name}</h3>
                        <p>{item.model}</p>
                        <div>
                            <Button variant="primary" style={{ margin: '5px' }} onClick={() => nav(`/item/${item._id}/edit`)}>Edit</Button>
                            <Button variant="danger" style={{ margin: '5px' }}>Delete</Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

          )
        })
    }
    </Accordion>
    <Button variant="primary" onClick={() => nav('/item/new')} style={{ margin: '10px' }}>New Item</Button>
    </>
}
</>
  )
  /* } else {
        return(
            <Spinner type="border" variant="primary"/>
        );
    } */
}
