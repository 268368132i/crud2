import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import { dataStateToReducer, errorStateToReducer, getAndSetItems, pendingStateToReducer, reducer } from "./libitem";
import { useEffect, useReducer } from "react";
import Spinner from "react-bootstrap/Spinner"



export function ItemsList(){

    const [state, dispatcher] =  useReducer(reducer, {});

    useEffect(()=>{
        const ac = new AbortController();

        getAndSetItems(dataStateToReducer(dispatcher),
        errorStateToReducer(dispatcher),
        pendingStateToReducer(dispatcher));

        return ()=>ac.abort();
    },[]);




    //if (state.data){
        return (
            <>
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                <Row>
                    <Col sm={4}>
                        {(state.pending || !state.data) &&
                        <>
                         <Spinner animation="border" variant="primary"/>
                         </>
                        }
                        {state.data &&  <ListGroup>
                            {
                                state.data.map((item, key) => (
                                    <ListGroup.Item action key={key} href={"#link"+key}>
                                        {item.name}
                                    </ListGroup.Item>

                                ))
                            }

                        </ListGroup>}
                    </Col>
                        <Col sm={8}>
                            {(state.pending || !state.data) &&
                                <>
                                    <p>Loading...</p>
                                    <Spinner animation="border" variant="primary" />
                                </>
                            }
                            {state.data &&
                                <Tab.Content>
                                    {
                                        state.data.map((item, key) => (
                                            <Tab.Pane key={key} eventKey={"#link" + key}>
                                                <h3>{item.name}</h3>
                                                <p>{item.model}</p>
                                            </Tab.Pane>

                                        ))
                                    }
                                </Tab.Content>
                            }
                        </Col>
                    </Row>
                </Tab.Container>
                {!state.pending &&
                    <div
                        style={{ "margin": "10px" }}
                    >
                        <Link
                            to="/item/new"
                        >
                            <Button>Add new</Button>
                        </Link>
                    </div>
                }
            </>

        )
    /*} else {
        return(
            <Spinner type="border" variant="primary"/>
        );
    }*/
}