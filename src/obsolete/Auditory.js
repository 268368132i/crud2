import Button from 'react-bootstrap/Button'
import { useEffect, useState, useMemo } from 'react'
import { Form, FormLabel, InputGroup } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { createAuditory, getAndSetAuditory, updateAuditory } from '../libauditory'
import { MyTextField } from '../FormElements'
import { routesInfo as _r, routeInfoToPathData as _rp } from '../routeTools'

export default function Auditory (props) {
  const { isNew } = props
  const _id = useParams().id
  const [name, setName] = useState(null)
  const [size, setSize] = useState(null)
  const [building, setBuilding] = useState(null)

  const [p, setP] = useState(!isNew)
  const [updatePending, setUpdatePending] = useState(false)
  const [err, setErr] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handle subit')
    if (isNew) {
      createAuditory({ name, size, building },
        setUpdatePending,
        setErr)
    } else {
      updateAuditory({ _id, name, size, building },
        setUpdatePending,
        setErr)
    }
  }
  const [path, setPath] = props.path
  useEffect(() => {
    setPath([
      _rp(_r.home),
      _rp(_r.auditories_all),
      _rp({ ..._r.auditory_edit, title: (building || '') + ' - ' + (name || '') }, true)
    ])
  }, [building, name])
  useEffect(() => {
    if (!isNew) {
      getAndSetAuditory(_id, {
        setName,
        setSize,
        setBuilding
      }, setErr, setP)
    }
  }, [])

  if (p) {
    return (
            <p>Loading...</p>
    )
  } else {
    return (
            <>
                <h2>
                    Auditory {name}
                </h2>
                {err && <div className="alert alert-danger" role="alert">
                    {String(err)}
                </div>}

                <Form onSubmit={handleSubmit}>
                    <MyTextField name="Name" value={name} setValue={setName} />
                    <MyTextField name="Size" value={size} setValue={setSize} />
                    <MyTextField name="Building" value={building} setValue={setBuilding} />
                    <div className="mb-3">
                        {updatePending
                          ? <Button disabled>Updating...</Button>
                          : <Button type="submit">Update</Button>
                        }
                    </div>
                </Form>

            </>
    )
  }
}
