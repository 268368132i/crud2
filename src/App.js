
import React, { useReducer, useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auditories from './Auditories'
import Auditory from './Auditory'
import { EditItem, NewItem } from './ItemForm'
import { ItemsList } from './ItemsList'
import { MyNavbar } from './MyNavbar'
import PathIndicator from './PathIndicator'
import { Welcome } from './Welcome'
import { UserProvider, reducer as userReducer } from './UserContext'
import UserProfile from './UserProfile'
import { routesInfo as _r } from './routeTools'
import UserList from './Users'

function App () {
  const [path, setPath] = useState([])

  const [state, dispatcher] = useReducer(userReducer, { name: 'Test User', id: 5 })

  return (
    <Router>
      <div className="App">
        <UserProvider value={[state, dispatcher]}>
        <MyNavbar />
        <Container>
          <PathIndicator path={[path, setPath]}/>
          <Routes>
            <Route path={_r.auditories_all.route} element={<Auditories path={[path, setPath]}/>} />
            <Route path={_r.auditory_edit.route} element={<Auditory path={[path, setPath]}/>} />
            <Route path="/auditory/new" element={<Auditory isNew={true} path={[path, setPath]}/>} />
            <Route path="/item/new" element={<NewItem isNew={true} path={[path, setPath]}/>} />
            <Route path={_r.item_edit.route} element={<EditItem path={[path, setPath]}/>}/>
            <Route path={_r.items_all.route} element={<ItemsList path={[path, setPath]}/>}/>
            <Route path="/profile" element={<UserProfile path={[path, setPath]}/>}/>
            <Route path={_r.users_all.route} element={<UserList path={[path, setPath]}/>}/>
            <Route path="/" element={<Welcome path={[path, setPath]}/>} />

          </Routes>
        </Container>

    </UserProvider>
      </div>
    </Router>
  )
}

export default App
