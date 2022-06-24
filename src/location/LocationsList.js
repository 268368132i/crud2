import React, { useState } from 'react'
import LocationFormFields from './LocationFormFields';
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";

export default function LocationsList(props) {
//Info for a path bar
    const [pathInfo, setPathInfo] = useState([routesInfo.home, routesInfo.auditories_all])
    console.log('PathInfo: ', pathInfo)  

    //Location data model
    const locModel = new Model('location')

    return (
        <>
        <PathIndicator pathInfo={pathInfo}/>
        <List
            dataModel={locModel}
            formFields={LocationFormFields}
            />
        </>
    )
}