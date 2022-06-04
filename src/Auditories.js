import { useEffect, useMemo, useState } from "react";
import { getAndSetAuditories } from "./libauditory";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button"
import Auditory from "./Auditory";
import { Link } from "react-router-dom";
export default function Auditories(props){


    const [auditories, setAuditories] = useState(null);
    const [err, setErr] = useState(null);
    const [p, setP] = useState(true);

    const columns = [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true
        },
        {
            name: "Size",
            selector: row => row.size,
            sortable: "true"
        },
        {
            name: "Building",
            selector: row => row.building,
            sortable: true
        },
        {
            name: "Action",
            button: true,
            cell: (row) =>{
                console.log("Row: ", row)
               return <Link className="btn" to={"/auditory/"+row.id+"/details"} data={row}>Edit</Link>
            }
        }
    ]

    const getAuditories = async function () {
        try {
            const result = await new Promise((resolve,reject)=>{
             setTimeout(async() => {
                try {
                    const data = await fetch("http://localhost:8000/auditories");
                    if (data.status!==200) throw new Error("Server error");
                    resolve(await data.json());   
                } catch (err) {
                    console.log("Rejecting fetch");
                    reject(err);
                }              
             }, 2000)
        });
        console.log("Result:", result);
        return result;
        } catch (err) {
            console.log("Error fetching auditories");
            return null;
        }
    }


    useEffect(()=>{
        const aC = new AbortController();
       /* async function fetch(){
            console.log("Fetching:");
            const auds = await getAuditories();
            console.log("Got auditories:", auds)
            setAuditories(auds);
        }
        fetch();*/
        getAndSetAuditories(setAuditories, setErr, setP);

        return ()=>aC.abort();
    },[]);



    return (
        <>
            <h1>
                Auditories
            </h1>
            {!auditories && <p>Loading...</p>}
            {auditories && <DataTable
                columns={columns}
                data={auditories ? auditories : []}
            />}
            {console.log(auditories)}

        </>
    )
}