import React from "react";
import Form from "react-bootstrap/Form";
import PropTypes from 'prop-types'

export default function PermissionsChooser(props){

    const [state, dispatcher] = props.state
    const { element } = props
    const labels = props.labels || {read: 'Read', modify: 'Modify'}

    return (
        <>
             <Form.Check
                type='switch'
                checked={!state[element]}
                label='Inherit from collection'
                onChange={(e) => dispatcher({
                    action: 'SET',
                    element: element,
                    value: e.target.checked ? false : { read: false, modify: false}
                })}
            />
            <Form.Check
                name='allowRead'
                type='switch'
                label={labels.read}
                onChange={(e) => dispatcher({
                    action: 'SET',
                    element: element,
                    value: { ...state[element] || {}, read: e.target.checked }
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
                onChange={(e) => dispatcher({
                    action: 'SET',
                    element: element,
                    value: { ...state[element] || {}, modify: e.target.checked }
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

PermissionsChooser.propTypes = {
    state: PropTypes.array.isRequired,
    element: PropTypes.string.isRequired,
    labels: PropTypes.object
}