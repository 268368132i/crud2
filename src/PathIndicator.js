import { Link } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb"

export default function PathIndicator(props){


    const [path, setPath ]= props.path;
    console.log("Path indicator", path);

    return (
        <Breadcrumb>

            {
                path.map((location, i) => (
                    <Breadcrumb.Item
                        key={i}
                        active={i === (path.length - 1)}
                    >
                        {i >= (path.length - 1)
                            ? <>{location.name}</>
                            : <Link to={location.route}>{location.name}</Link>
                        }
                    </Breadcrumb.Item>
                ))
            }
        </Breadcrumb>
    )
}