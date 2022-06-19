import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { updateAuditory } from './libauditory'
import { errorStateToReducer, pendingStateToReducer } from './libitem'
import { useEffect } from 'react'

export function AuditoryEdit (props) {
  const [state, dispatcher] = props.show

  const handleSubmit = (e) => {
    e.preventDefault()
    updateAuditory({
      _id: state._id,
      name: state.name,
      size: state.size,
      building: state.building
    }, errorStateToReducer(dispatcher), pendingStateToReducer(dispatcher), props.success)
  }

  return (
        <Modal
            show={state.show}
            onHide={(e) => dispatcher({ action: 'SET', element: 'show', value: false })}
            >
            <Modal.Header closeButton>
                <Modal.Title>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control
                        type="text"
                        name="name"
                        value={state.name || ''}
                        onChange={(e) => dispatcher({ action: 'SET', element: 'name', value: e.target.value })}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="secondary" onClick={() => dispatcher({ action: 'SET', element: 'show', value: false })}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
  )
}
