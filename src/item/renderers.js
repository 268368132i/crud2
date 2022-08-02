import React from 'react'
import { Container, Row, Col } from "react-bootstrap"

export const listRenderers = {
    main: (item) => {
        return (
            <>
                {`${item.name}`}
            </>
        )
    },
    description: (item) => {
        return (
            <Container>
                <Row>
                    <Col sm>{`Location: ${item.location}`}</Col>
                    <Col sm>{`Inventory number: ${item.inventoryNum}`}</Col>
                </Row>
                <Row>
                    <Col sm>{`Model: ${item.model}`}</Col>
                </Row>
            </Container>
        )
    }
}