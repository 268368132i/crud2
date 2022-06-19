import React, { useMemo, useReducer, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'

import { getReducer, reducer } from './libitem'

import { getUsers } from './libuser'
import UserModal from './UserModal'
import { NavLink } from 'react-router-dom'

export const UserListContext = React.createContext({})
const UserListProvider = UserListContext.Provider;
const customActions = new Array();
customActions['addNewUserAndCloseModal'] = (state, action)=>{
  //TODO empty array after concat
  const newUsers = state.users.concat([action.value])
  console.log("Adding new user:", [action.value], " to other users:", state.users,
  "Result is: ", newUsers)
  const newState = {...state, show: false, users: newUsers}
  return newState;
}
const userListReducer = getReducer(customActions)

export default function UserList (props) {

  console.log("UserListReducer: ", userListReducer);

  //const [modalState, modalDispatch] = useReducer(reducer, {})
  const [userListState, userListDispatcher] = useReducer(userListReducer, {})

  useEffect(() => {
    //console.log("UserList:", userListState, userListDispatcher);
    //userListDispatcher({action: "SET", element: "test", value: "test"});
    getUsers(userListDispatcher)
  }, [])

  useEffect(()=>{
    console.log(userListState.test);
  },[userListState.test]);

  const userList = useMemo(() => (
            <Accordion>
                {userListState.users?.map((user) => (
                    <Accordion.Item key={user._id} eventKey={user._id}>
                        <Accordion.Header>{user.firstName} {user.lastName}</Accordion.Header>
                        <Accordion.Body>
                            <div>
                                <Button as={NavLink} variant="primary" style={{ margin: '5px' }} to={'/user/id/edit'}>Edit</Button>
                                <Button variant="danger" style={{ margin: '5px' }}>Delete</Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
    </Accordion>
  ), [userListState.users])

  useEffect(() => {
    console.log('Userlist:', userList)
  }, [userListState.users])

  const handleShow = (e) => {
    userListDispatcher({ action: 'SET', element: 'show', value: !userListState.show })
  }

  return (
        <>
        <UserListProvider value={[userListState, userListDispatcher]}>
            <UserModal showState={[userListState, userListDispatcher]}/>
        </UserListProvider>
            {userList}
            <Button onClick={handleShow}>New</Button>
        </>
    );
}
