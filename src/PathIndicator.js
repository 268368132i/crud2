import React, { useEffect, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

export default function PathIndicator(props) {
    return (
        <>
        {props.pathInfo?.length &&
            <Breadcrumb>
            {props.pathInfo.map((page, i) => (
                <Breadcrumb.Item
                    active
                >
                    {i === (props.pathInfo.length - 1)
                        ? <span>{page.title}</span>
                        : (<Link to={page.route}>
                            {page.title}
                        </Link>)
                    }
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    }
    </>
    )


/*   return (
        <Breadcrumb>

            {
                path.map((location, i) => (
                    <Breadcrumb.Item
                        key={i}
                        /*linkAs={NavLink}*/
/*                         to={ location.route }
                        
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
    ) */
} 
