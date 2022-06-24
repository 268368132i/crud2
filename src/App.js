
import React, { useReducer, useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/* import Auditories from './obsolete/Auditories'
import Auditory from './obsolete/Auditory'
import UserProfile from './UserProfile'
import UserList from './Users'
import { EditItem, NewItem } from './ItemForm' */
import { List } from './listRenderer/List'
import { MyNavbar } from './MyNavbar'
import PathIndicator from './PathIndicator'
import { Welcome } from './Welcome'
import { UserProvider, reducer as userReducer } from './UserContext'
import { routesInfo, routesInfo as _r } from './routeTools'
import ItemFormFields from './item/ItemFormFields'
import LocationFormFields from './location/LocationFormFields'
import UserFormFields from './user/UserFormFields'
import {Model} from './lib/libREST'
import {listRenderers as userListRenderers} from './user/renderers'
import LocationsList from './location/LocationsList'
import UsersList from './user/UsersList'
import ItemsList from './item/ItemsList'

function App () {
  // const [path, setPath] = useState([])

  const [state, dispatcher] = useReducer(userReducer, { name: 'Test User', id: 5 })




  return (
    <Router>
      <div className="App">
        <UserProvider value={[state, dispatcher]}>
        <MyNavbar />
        <Container>
          <Routes>
            <Route path={_r.auditories_all.route} element={<LocationsList/>} />
            <Route path={_r.users_all.route} element={<UsersList/>}/>
            <Route path={_r.items_all.route} element={<ItemsList/>}/>
            <Route path={_r.home.route} element={<Welcome pathInfo={_r.home}/>} />

          </Routes>
        </Container>

    </UserProvider>
      </div>
    </Router>
  )
}

export default App
