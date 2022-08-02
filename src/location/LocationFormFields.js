import {Model, getReducer} from '../lib/libREST'
import React, { useReducer, useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'

const locReducer = getReducer()

export default function LocationFormFields(props) {
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
            {useMemo(() => (
                <Form.Group className="mb-3" key='size'>
                    <Form.Label>
                        Size
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.size}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'size',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.size])}
            {useMemo(() => (
                <Form.Group className="mb-3" key='building'>
                    <Form.Label>
                        Building
                    </Form.Label>
                    <Form.Control
                        type='text'
                        value={state.building}
                        onChange={(e) => dispatcher({
                            action: 'SET',
                            element: 'building',
                            value: e.target.value
                        })}
                    />
                </Form.Group>
            ), [state.building])}
        </>
    )
}

LocationFormFields.propTypes = {
    stateAndDispatcher: PropTypes.array.isRequired
}