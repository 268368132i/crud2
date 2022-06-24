import React, { useState } from 'react'
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";
import UserFormFields from './UserFormFields';
import {listRenderers} from './renderers'
export default function UsersList(props) {
//Info for a path bar
    const [pathInfo, setPathInfo] = useState([routesInfo.home, routesInfo.users_all])

    //User data model
    const userModel = new Model('user')

    return (
        <>
        <PathIndicator pathInfo={pathInfo}/>
        <List
            dataModel={userModel}
            formFields={UserFormFields}
            itemRenderers={listRenderers}

            />
        </>
    )
}