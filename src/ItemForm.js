import { useReducer } from "react";
import  FormLabel  from "react-bootstrap/FormLabel";
import  Form from "react-bootstrap/Form";
import  Button from "react-bootstrap/Button";
import  Spinner from "react-bootstrap/Spinner";

import  Alert from "react-bootstrap/Alert";

import { createItem, reducer } from "./libitem";
import { useNavigate } from "react-router-dom";

export function NewItem(){
    const [state, dispatch] = useReducer(reducer,{});

    const nav = useNavigate();

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
            name: "invNum",
            type: "text",
        },
        {
            title: "In use since",
            name: "inUseSince",
            type: "date",

        }
    ];
    return (

        <ItemForm 
            elements={elements} 
            state={state} 
            dispatcher={dispatch}
            submitAction = {()=>{
                createItem({
                    name: state.name,
                    model: state.model,
                    inUseSince: state.inUseSince
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

function ItemForm(props){


    const handleSet = (e) => {
        props.dispatcher({
            action: "SET", 
            element: e.target.name, 
            value: e.target.value
        });
    }
    console.log(props);


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
                props.elements?.map((element, key) => (
                    <Form.Group key={key}>
                        <Form.Label>{element.title}</Form.Label>
                        <Form.Control
                            className="form-control"
                            type={element.type}
                            name={element.name}
                            value={props.state[element.name] || ""}
                            onChange={handleSet}
                        />
                    </Form.Group>
                ))
            }
            {
                props.state.error &&
                    <Form.Group style={{margin: "10px"}}>
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