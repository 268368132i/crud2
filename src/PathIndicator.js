import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import PropTypes from 'prop-types'

export default function PathIndicator(props) {
    return (
        <>
        {props.pathInfo?.length &&
            <Breadcrumb>
            {props.pathInfo.map((page, i) => (
                <Breadcrumb.Item
                    key={page.title}
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

} 

PathIndicator.propTypes = {
    pathInfo: PropTypes.array.isRequired
}