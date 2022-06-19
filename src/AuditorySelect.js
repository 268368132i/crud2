import Form from 'react-bootstrap/Form'

export default function AuditorySelect (props) {
  const [selected, setSelected] = props.selected
  const { auds } = props

  return (
        <Form.Select value={selected} onChange={e => setSelected(e.target.value)}>
            {auds && auds.map(a => {
              return (
                    <option key={a._id} value={a._id}>{`${a.building} / ${a.name}`}</option>
              )
            })}
        </Form.Select>
  )
}
