import { useMemo, useReducer, useEffect } from "react";
import React from "react";
import Button from "react-bootstrap/Button"
import Accordion from "react-bootstrap/Accordion"

import { reducer } from "./libitem";

import { getUsers } from "./libuser";
import UserModal from "./UserModal";
import { NavLink } from "react-router-dom";

export const UserListContext = React.createContext({});
const UserListProvider = UserListContext.Provider;

export default function UserList(props){

    const [modalState, modalDispatch] = useReducer(reducer,{});
    const [listState, listDispatcher] = useReducer(reducer,{});

    useEffect(() => {
        getUsers(listState, listDispatcher);
    }, []);

    const userList = useMemo(() => (
            <Accordion> 
                {listState.users?.map((user) => (
                    <Accordion.Item key={user._id} eventKey={user._id}>
                        <Accordion.Header>{user.firstName} {user.lastName}</Accordion.Header>
                        <Accordion.Body>
                            <div>
                                <Button as={NavLink} variant="primary" style={{"margin": "5px"}} to={`/user/id/edit`}>Edit</Button>
                                <Button variant="danger" style={{"margin": "5px"}}>Delete</Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
    </Accordion>
    ), [listState.users]);

    useEffect(() => {
        console.log("Userlist:", userList);
    }, [listState.users, ]);

    const handleShow = (e) => {
        modalDispatch({ action: "SET", element: "show", value: modalState.show ? false : true });
    }

    return (
        <>
        <UserListProvider value={[listState, listDispatcher]}>
            <UserModal showState={[modalState, modalDispatch]}/>
        </UserListProvider>
            {userList}

           
            <Button onClick={handleShow}>New</Button>
        </>
    );
}