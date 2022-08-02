import React, { useState } from 'react'
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";
import CollectionPermissionsFormFields from './CollectionPermissionsFormFields';
import { listRenderers } from './renderers';

export default function CollectionPermissionsList() {
//Info for a path bar
     const pathInfo = useState([
        routesInfo.home,
        routesInfo.collectionPermissions_all
    ])[0]
    console.log('PathInfo: ', pathInfo)  

    //Location data model
    const collAccessModel = new Model('coll_access')

    return (
        <>
        <PathIndicator pathInfo={pathInfo}/>
        <List
            dataModel={collAccessModel}
            formFields={CollectionPermissionsFormFields}
            itemRenderers={listRenderers}
            />
        </>
    )
}