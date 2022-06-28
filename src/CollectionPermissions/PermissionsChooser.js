import React, { useCallback } from "react";
import Form from "react-bootstrap/Form";

export default function PermissionsChooser(props){

    const [state, dispatcher] = props.state
    const { element } = props
    const labels = props.labels || {read: 'Read', modify: 'Modify'}

    return (
        <>
            <Form.Check
                name='allowRead'
                type='switch'
                label={labels.read}
                onChange={(e)=>dispatcher({
                    action: 'SET',
                    element: element,
                    value: {...state[element] || {}, read: e.target.checked}
                })}
                    checked={(state[element] && state[element].read)
                    ? state[element].read
                    : false
                    }
            >
            </Form.Check>
            <Form.Check
                name='allowRead'
                type='switch'
                label={labels.modify}
                onChange={(e)=>dispatcher({
                    action: 'SET',
                    element: element,
                    value: {...state[element] || {}, modify: e.target.checked}
                })}
                checked={(state[element] && state[element].modify)
                ? state[element].modify
                : false
                }
            >
            </Form.Check>
            </>
    )
}