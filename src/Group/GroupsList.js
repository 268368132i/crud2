import React, { useState } from 'react'
import GroupFormFields from './GroupFormFields';
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";

export default function GroupsList(props) {
//Info for a path bar
    const [pathInfo, setPathInfo] = useState([routesInfo.home, routesInfo.group_all])
    console.log('PathInfo: ', pathInfo)  

    //Location data model
    const grpModel = new Model('group')

    return (
        <>
        <PathIndicator pathInfo={pathInfo}/>
        <List
            dataModel={grpModel}
            formFields={GroupFormFields}
            />
        </>
    )
}