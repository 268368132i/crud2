import React, { useState } from 'react'
import GroupFormFields from './GroupFormFields';
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";

export default function GroupsList() {
//Info for a path bar
    const pathInfo = useState([routesInfo.home, routesInfo.group_all])[0]

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