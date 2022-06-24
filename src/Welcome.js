import { Button, Card, CardGroup, Col, Row } from 'react-bootstrap'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MyCard from './MyCard'
import { routesInfo as _r } from './routeTools'
import PathIndicator from './PathIndicator'

export function Welcome (props) {

  const chapters = [
    {
      key: 0,
      title: 'Auditories',
      text: 'Check and modify auditories',
      link: '/auditory/all'
    },
    {
      key: 1,
      title: 'Equipment',
      text: 'Check, place and modify equipment info',
      link: '/item/all'
    },
    {
      key: 2,
      title: _r.users_all.title,
      text: 'Manage users',
      link: _r.users_all.route
    }
  ]
  return (
        <>
        <PathIndicator pathInfo={_r.home}/>
        <CardGroup>
            {chapters.map(c => (
                <Link to={c.link} key={c.key}>
                    <MyCard title={c.title} key={c.key}>{c.text}</MyCard>
                </Link>
            ))}
        </CardGroup>
        </>
  )
}
