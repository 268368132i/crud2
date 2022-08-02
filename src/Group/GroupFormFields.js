import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

export default function GroupFormFields(props) {
    const [state, dispatcher] = props.stateAndDispatcher


    return (
        <>
            {useMemo(() => (
                <Form.Group className="mb-3" key='name'>
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.name}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'name',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.name])}
        </>
    )
}

GroupFormFields.propTypes = {
    stateAndDispatcher: PropTypes.array.isRequired
}