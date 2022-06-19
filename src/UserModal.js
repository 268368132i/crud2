import Modal from 'react-bootstrap/Modal'
import UserProfile from './UserProfile'

export default function UserModal (props) {
  const [state, dispatcher] = props.showState

  return (
        <Modal
            show={state.show}
            onHide={(e) => dispatcher({ action: 'SET', element: 'show', value: false })}
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    New user
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UserProfile modalDispatcher={dispatcher}/>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
  )
}
