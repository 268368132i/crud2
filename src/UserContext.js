import React from 'react'
import { getReducer } from './lib/libREST'

export const reducer = getReducer()

const UserContext = React.createContext({})

export const UserProvider = UserContext.Provider

export default UserContext
