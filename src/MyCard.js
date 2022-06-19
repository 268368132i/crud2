import Card from 'react-bootstrap/Card'

export default function MyCard (props) {
  return (
        <>
        <Card>
            <Card.Body>
                <Card.Title>
                    {props.title}
                </Card.Title>
                <Card.Text>
                    {props.children}
                </Card.Text>
            </Card.Body>
        </Card>
        </>
  )
}
