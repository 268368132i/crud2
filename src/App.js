
import React, { useEffect, useReducer } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/* import Auditories from './obsolete/Auditories'
import Auditory from './obsolete/Auditory'
import UserProfile from './UserProfile'
import UserList from './Users'
import { EditItem, NewItem } from './ItemForm' */
import { MyNavbar } from './MyNavbar'
import { Welcome } from './Welcome'
import { UserProvider } from './UserContext'
import { routesInfo as _r } from './routeTools'
import LocationsList from './location/LocationsList'
import UsersList from './user/UsersList'
import ItemsList from './item/ItemsList'
import Login from './auth/Login'
import Profile from './auth/Profile'
import { authModel, authReducer } from './auth/libAuth'
import GroupsList from './Group/GroupsList'
import CollectionPermissionsList from './CollectionPermissions/CollectionPermissionsList'

function App () {
  // const [path, setPath] = useState([])

  const [userState, userDispatcher] = useReducer(authReducer, {username: '', password: ''})

  useEffect(() => {
    const ac = new AbortController()
    authModel.getSession(userDispatcher)
    return ac.abort()
  }, [])


  return (
    <Router>
      <div className="App">
        <UserProvider value={[userState, userDispatcher]}>
        <MyNavbar />
        <Container>
          <Routes>
            <Route path={_r.auditories_all.route} element={<LocationsList/>} />
            <Route path={_r.users_all.route} element={<UsersList/>}/>
            <Route path={_r.items_all.route} element={<ItemsList/>}/>
            <Route path={_r.login.route} element={<Login pathInfo={_r.login}/>} />
            <Route path={_r.profile.route} element={<Profile/>}/>
            <Route path={_r.group_all.route} element={<GroupsList/>}/>
            <Route path={_r.collectionPermissions_all.route} element={<CollectionPermissionsList/>}/>
            <Route path={_r.home.route} element={<Welcome pathInfo={_r.home}/>} />
          </Routes>
        </Container>

    </UserProvider>
      </div>
    </Router>
  )
}

export default App
