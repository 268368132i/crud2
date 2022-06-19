import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { getAndSetAuditories, deleteAuditory } from './libauditory'
import DataTable from 'react-data-table-component'
import Button from 'react-bootstrap/Button'
import Auditory from './Auditory'
import { Link, NavLink } from 'react-router-dom'
import { routesInfo as _r, routeInfoToPathData as _rp } from './routeTools'
import { BsGear, BsTrash } from 'react-icons/bs'
import { AuditoryEdit } from './AuditoryModal'
import { reducer } from './libitem'

export default function Auditories (props) {
  const [auditories, setAuditories] = useState(null)
  const [err, setErr] = useState(null)
  const [p, setP] = useState(true)

  const [path, setPath] = props.path
  useEffect(() => {
    setPath([
      _rp(_r.home),
      _rp(_r.auditories_all, true)
    ])
  }, [])

  const [modalState, modalDispatcher] = useReducer(reducer, {})

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Size',
      selector: row => row.size,
      sortable: 'true'
    },
    {
      name: 'Building',
      selector: row => row.building,
      sortable: true
    },
    {
      name: 'Action',
      button: true,
      cell: (row) => {
        console.log('Row: ', row)
        return (
                <>
                {/* <Button as={NavLink} to={"/auditory/"+row._id+"/edit"} data={row}><BsGear/></Button> */}
                <Button
                onClick={(e) => {
                  modalDispatcher({ action: 'SET', element: 'show', value: true })
                  modalDispatcher({ action: 'SETMANY', value: row })
                }}
                data={row}>
                    <BsGear/>
                </Button>
                <Button variant="danger" onClick={(e) => { console.log('Clicked', e.target) }}><BsTrash/></Button>
                </>
        )
      }
    }
  ]
  useEffect(() => {
    console.log('Loading auds')

    const aC = new AbortController()
    getAndSetAuditories(setAuditories, setErr, setP)
    return () => aC.abort()
  }, [])

  useEffect(() => {
    console.log('Modal state: ', modalState)
  }, [modalState])

  const table = useMemo(() => (
        <DataTable
        columns={columns}
        data={auditories || []}
    />
  ), [auditories])

  return (
        <>
            <h1>
                Auditories
            </h1>
            {!auditories && <p>Loading...</p>}
            {auditories &&
            <>
            <AuditoryEdit show={[modalState, modalDispatcher]} success={() => {}}/>
            {/* <DataTable
                columns={columns}
                data={auditories ? auditories : []}
            /> */}
            {table}
            <Button as={NavLink} to="/auditory/new">Add new</Button>
            </>
            }
            {console.log(auditories)}

        </>
  )
}
