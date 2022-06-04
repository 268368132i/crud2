import { Button, Card, CardGroup } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import {Link} from 'react-router-dom';
import MyCard from "./MyCard";

export function Welcome(props) {

    const chapters = [
        {
            key: 0,
            title: "Auditories",
        text: "Check and modify auditories",
        link: "/auditory/all"},
        {
            key: 1,
            title: "Equipment",
        text: "Check, place and modify equipment info",
        link: "/item/all"}
    ]
    return (
        <>
        <CardGroup>
            {chapters.map(c=>(
                <Link to={c.link} key={c.key}>
                    <MyCard title={c.title} key={c.key}>{c.text}</MyCard>
                </Link>
            ))}
        </CardGroup>
        </>
    )
}