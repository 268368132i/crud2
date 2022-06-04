import  Button  from "react-bootstrap/Button";
import { useEffect, useState, useMemo } from "react";
import { Form, FormLabel, InputGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { createAuditory, getAndSetAuditory, updateAuditory } from "./libauditory";
import {MyTextField} from "./FormElements"

export default function Auditory({isNew}){
    const id = useParams().id;
    const [name, setName] = useState(null);
    const [size, setSize] = useState(null);
    const [building, setBuilding] = useState(null);

    const [p, setP] = useState(isNew ? false : true);
    const [updatePending, setUpdatePending] = useState(false);
    const [err, setErr] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handle subit");
        if (isNew) {
            createAuditory({name: name, size: size, building: building },
                setUpdatePending,
                setErr);
        } else {
            updateAuditory({ id: id, name: name, size: size, building: building },
                setUpdatePending,
                setErr);
        }
    }

    useEffect(() => {
        if (!isNew) {
            getAndSetAuditory(id, {
                setName: setName,
                setSize: setSize,
                setBuilding: setBuilding
            }, setErr, setP)
        }
    }, [])


    if (p) {
        return (
            <p>Loading...</p>
        )
    } else {
        return (
            <>
                <h2>
                    Auditory {name}
                </h2>
                {err && <div class="alert alert-danger" role="alert">
                    {String(err)}
                </div>}

                <Form onSubmit={handleSubmit}>
                    <MyTextField name="Name" value={name} setValue={setName} />
                    <MyTextField name="Size" value={size} setValue={setSize} />
                    <MyTextField name="Building" value={building} setValue={setBuilding} />
                    <div className="mb-3">
                        {updatePending
                            ? <Button disabled>Updating...</Button>
                            : <Button type="submit">Update</Button>
                        }
                    </div>
                </Form>

            </>
        )
    }
}