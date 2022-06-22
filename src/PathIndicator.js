import { Link, NavLink } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

export default function PathIndicator (props) {
  const [path, setPath] = props.path
  console.log('Path indicator', path)

  return (
        <Breadcrumb>

            {
                path.map((location, i) => (
                    <Breadcrumb.Item
                        key={i}
                        /*linkAs={NavLink}*/
                        to={ location.route }
                        
                        active
                    >
                        {i === (path.length-1)
                        ? <span>{location.name}</span>
                        :( <Link to={ location.route }>
                        {location.name}
                        </Link>)
                        }
                    </Breadcrumb.Item>
                ))
            }
        </Breadcrumb>
    )
}
