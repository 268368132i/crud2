import { useEffect, useMemo, useReducer, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import  Form from "react-bootstrap/Form";
import  Button from "react-bootstrap/Button";
import  Spinner from "react-bootstrap/Spinner";

import  Alert from "react-bootstrap/Alert";

import { createItem, dataStateToReducer, errorStateToReducer, getAndSetItem, pendingStateToReducer, reducer, updateItem } from "./libitem";
import { useNavigate } from "react-router-dom";
import { getAndSetAuditories } from "./libauditory";
import AuditorySelect from "./AuditorySelect";
import { routesInfo as _r, routeInfoToPathData as _rp} from "./routeTools";


const FormField = React.memo(_FormField, areEqual);
const FormLabel = React.memo(_FormLabel, ()=>true);
const FormGroup = React.memo(_FormGroup, ()=>true);


export function NewItem(){
    const [state, dispatch] = useReducer(reducer,{});

    const [elements, setElements] = useState([]);

    const nav = useNavigate();

    useEffect(()=>{
        setElements([
            {
                title: "Name",
                name: "name",
                type: "text",
            },
            {
                title: "Model",
                name: "model",
                type: "text",
            },
            {
                title: "Inventory Number",
                name: "inventoryNum",
                type: "text",
            },
            {
                title: "In use since",
                name: "inUseSince",
                type: "date",
    
            },
            {
                title: "Location",
                name: "location",
                type: "number",
                source: ()=>{
                        return (
                            <AuditorySelect 
                            selected={[
                                state.location, dataStateToReducer(dispatch, "location")
                            ]}
                            auds={state.auds}
                            />
                        )
                }
    
            },
            {
                title: "Owner",
                name: "owner",
                type: "number",
    
            }
        ]);
},[state.auds]);
    useEffect(() => {
        getAndSetAuditories(
            dataStateToReducer(dispatch, "auds"),
            errorStateToReducer(dispatch),
            pendingStateToReducer(dispatch));

    }, []);
    return (

        <ItemForm 
            elements={elements} 
            state={state} 
            dispatcher={dispatch}
            submitAction = {()=>{
                createItem({
                    name: state.name,
                    model: state.model,
                    inventoryNum: state.inventoryNum,
                    location: state.location, //parseInt(state.location,10),
                    inUseSince: state.inUseSince,
                    owner: parseInt(state.owner,10)
                },(s)=>{
                    dispatch({action: "PENDING", value : s});
                }, (err)=>{
                    dispatch({action: "ERROR", value : err});
                }, ()=>{
                    nav(-1);
                });
            }}
            >
                {!state.pending && <Button type="submit" style={{ margin: "0 auto"}}>Create</Button>}
                {state.pending && <Spinner animation="border" variant="primary"/>}
                <Button variant="secondary" onClick={()=>nav(-1)}>Back</Button>
        </ItemForm>
    )
}

export function EditItem(props){
    const [state, dispatch] = useReducer(reducer,{});
    const id = useParams().id;

    const [path, setPath] = props.path;

    useEffect(()=>{
        console.log(`Setting path with name ${state.name}`);
        setPath([
            _rp(_r.home),
            _rp(_r.items_all),
            {..._rp(_r.item_edit,true), name: state.name}
        ])
    },[state.pending]);

    const nav = useNavigate();
    useEffect(()=>{
        const ac = new AbortController();
        getAndSetItem(id, dispatch, errorStateToReducer(dispatch), pendingStateToReducer(dispatch));
        getAndSetAuditories(
            dataStateToReducer(dispatch, "auds"),
            errorStateToReducer(dispatch),
            pendingStateToReducer(dispatch));
        return ac.abort();
    },[])
    useEffect(()=>{
    },[state.pending]);

    const elements = [
        {
            title: "Name",
            name: "name",
            type: "text",
        },
        {
            title: "Model",
            name: "model",
            type: "text",
        },
        {
            title: "Inventory Number",
            name: "inventoryNum",
            type: "text",
        },
        {
            title: "In use since",
            name: "inUseSince",
            type: "date",

        },
        {
            title: "Location",
            name: "location",
            type: "number",
            source: ()=>{
                    return (
                        <AuditorySelect 
                        selected={[
                            state.location, dataStateToReducer(dispatch, "location")
                        ]}
                        auds={state.auds}
                        />
                    )
            }

        },
        {
            title: "Owner",
            name: "owner",
            type: "number",

        }
    ];
    return (

        <ItemForm 
            elements={elements} 
            state={state} 
            dispatcher={dispatch}
            submitAction = {()=>{
                updateItem({
                    _id: state._id,
                    name: state.name,
                    model: state.model,
                    inventoryNum: state.inventoryNum,
                    location: state.location,//parseInt(state.location,10),
                    inUseSince: state.inUseSince,
                    owner: parseInt(state.owner,10)
                },
                pendingStateToReducer(dispatch),
                errorStateToReducer(dispatch))
            }}
            >
                {!state.pending && <Button type="submit" style={{ margin: "0 auto"}}>Save</Button>}
                {state.pending && <Spinner animation="border" variant="primary"/>}
                <Button variant="secondary" onClick={()=>nav(-1)}>Back</Button>
        </ItemForm>
    )
}



function ItemForm(props){


    const handleSet = (e) => {
        props.dispatcher({
            action: "SET", 
            element: e.target.name, 
            value: e.target.value
        });
    }



    return (
        <>
        <Form onSubmit={(e)=>{
            e.preventDefault();
            if (typeof props.submitAction !== "function"){
                console.log("Submit function not specified");
                    return;
                }
                props.submitAction();
            }}>
                {
                    props.elements?.map((element, key) =>                        
                        (
                            <Form.Group key={key}>
                                <Form.Label>{element.title}</Form.Label>
                                {typeof element.source === "function"
                                    ? element.source()
                                   /*: <Form.Control
                                    className="form-control"
                                    type={element.type}
                                    name={element.name}
                                    value={props.state[element.name] || ""}
                                    onChange={handleSet}
                        />*/                      
                    
                            :<FormField
                            type={element.type}
                            name={element.name}
                            value={props.state[element.name] || ""}
                            handleSet={handleSet}
                                />
                            }
                       </Form.Group>
                    )
                    )
                }
                {
                    props.state.error &&
                    <Form.Group style={{ margin: "10px" }}>
                        <Alert variant="danger">{String(props.state.error)}</Alert>
                    </Form.Group>
            }
            <Form.Group style={{width:"100%", margin: "10px"}}>
                {props.children}
            </Form.Group>
        </Form>
        </>
    )
}

function _FormField({title, type, name, value, handleSet}){
    return (
       <Form.Control
        className="form-control"
        type={type}
        name={name}
        value={value || ""}
        onChange={handleSet}
    />
    )
}

function _FormLabel(props){
   return <Form.Label>{props.children}</Form.Label>
}

function _FormGroup(props){
    return <Form.Group>{props.children}</Form.Group>
}

function areEqual(oldProps, newProps){
    return oldProps.name === newProps.name && oldProps.value === newProps.value;
}

