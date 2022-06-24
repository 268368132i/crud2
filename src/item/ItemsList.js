import React, { useState } from 'react'
import { Model } from '../lib/libREST'
import { List } from "../listRenderer/List";
import {routesInfo} from '../routeTools'
import PathIndicator from "../PathIndicator";
import ItemFormFields from './ItemFormFields';
import { listRenderers } from './renderers';


export default function ItemsList(props) {
    //Info for a path bar
    const [pathInfo, setPathInfo] = useState([routesInfo.home, routesInfo.items_all])

    //Items data model
    const itemModel = new Model('items')

    return (
        <>
        <PathIndicator pathInfo={pathInfo}/>
        <List
            dataModel={itemModel}
            formFields={ItemFormFields}
            itemRenderers={listRenderers}
            />
        </>
    )
}