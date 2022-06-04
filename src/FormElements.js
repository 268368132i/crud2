import React from "react";
import FormLabel from "react-bootstrap/FormLabel"

/*function MyTextField({name, value, setValue1}){
    render (
        <div className="mb-3">
            <FormLabel>{name}</FormLabel>
        <input type="text" onChange={e => setValue(e.target.value)} className="form-control" value={value || ""}></input>
    </div>
    )
});*/


function _MyTextField(props){
    const {name, value, setValue} = props;
    return (
        <div className="mb-3">
            <FormLabel>{name}</FormLabel>
        <input type="text" onChange={e => setValue(e.target.value)} className="form-control" value={value || ""}></input>
    </div>
    )
}

function areEqual(prevProps, nextProps){
    return prevProps.name === nextProps.name && prevProps.value === nextProps.value;
}

export const MyTextField = React.memo(_MyTextField, areEqual);