import React from 'react'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'

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

MyCard.propTypes = {
    title: PropTypes.string,
    children: PropTypes.element
}
