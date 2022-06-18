import { useContext, useEffect, useState, useReducer, useMemo } from "react";
import  Form  from "react-bootstrap/Form";
import  Alert  from "react-bootstrap/Alert";
import  Button  from "react-bootstrap/Button";
import  Spinner  from "react-bootstrap/Spinner";
import {reducer} from "./libitem";
import UserContext from "./UserContext";
import DefaultSpinner from "./DefaultSpinner";
import { create } from "./libuser";
import { UserListContext } from "./Users";


export default function UserProfile(props){

    const [contextState, contextDispatcher] = useContext(UserContext);
    const [userListState, userListDispatcher] = useContext(UserListContext);
    const [path, setPath] = props.path || [false, false];

    useEffect(()=>{
        if (!setPath) return;
        setPath([{
            route:"/profile",
            name:"Profile",
            isActive: true
    }])
    },[])

    const [firstName, setName] = useState("");

    const [formState, formDispatcher] = useReducer(reducer, {});
    const [id, setId] = useState("");


    useEffect(()=>{
        setName(contextState.name);
        setId(contextState.id);
    },[contextState.name]);

    useEffect(()=>{
        console.log(`Form state:`, formState);
    },[formState]);

    function submitAction(e){
        e.preventDefault();
        /*contextDispatcher({action: "SET", name:"user_name", value:firstName});
        contextDispatcher({action: "SET", name:"id", value:parseInt(id,10)});*/
        const user = {
            firstName: formState.firstName,
            lastName: formState.lastName,
            username: formState.username,
            password: formState.password,
        }
        create(user, formDispatcher, ()=>{
            const new_users = userListState.users.concat([user]);
            userListDispatcher({
                action: "SET",
                element: "users",
                value: new_users
            });
            formDispatcher({
                action: "SET",
                element: "formLocked",
                value: true
            });
            if (props.modalDispatcher){
                props.modalDispatcher({
                    action: "SET",
                    element: "show",
                    value: false
                });
            }
        });
    }

    return (
        <Form onSubmit={submitAction}>
            {useMemo(() => (<Form.Group>
                <Form.Label>Login</Form.Label>
                <Form.Control
                    type="text"
                    disabled={formState.formLocked || formState.pending}
                    onChange={e => formDispatcher({
                        action: "SET",
                        element: "username",
                        value: e.target.value
                    })}
                    value={formState.username}>
                </Form.Control>
            </Form.Group>),[formState.username, formState.pending, formState.formLocked])}
            {useMemo(()=>(<Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control 
                    type="text"
                    disabled={formState.formLocked || formState.pending}
                    onChange={e => formDispatcher({
                        action: "SET",
                        element: "firstName",
                        value: e.target.value
                    })}
                    value={formState.firstName}>
                </Form.Control>
            </Form.Group>),[formState.firstName, formState.pending, formState.formLocked])}
            {useMemo(()=>(<Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control 
                    type="text"
                    disabled={formState.formLocked || formState.pending}
                    onChange={e => formDispatcher({
                        action: "SET",
                        element: "lastName",
                        value: e.target.value
                    })}
                    value={formState.lastName}>
                </Form.Control>
            </Form.Group>),[formState.lastname, formState.pending, formState.formLocked])}
            {useMemo(()=>(<Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    disabled={formState.formLocked || formState.pending}
                    onChange={e => formDispatcher({
                        action: "SET",
                        element: "password",
                        value: e.target.value
                    })}
                    value={formState.password}>
                </Form.Control>
            </Form.Group>),[formState.password, formState.pending, formState.formLocked])}
            {formState._error &&
                <Form.Group>
                <Alert
                    variant="danger"
                    onClose={(e)=>formDispatcher({action: "ERROR", value: false})}
                    dismissible
                    >
                        <p>{String(formState._error)}</p>
                    </Alert>
            </Form.Group>}
            <Form.Group>
                {formState.pending
                ?<DefaultSpinner/>
                :<Button type="submit" style={{ "margin": "10px" }}>Save changes</Button>
                }
            </Form.Group>
        </Form>
    )
}