import React from 'react'

const UserContext = React.createContext({})

export const UserProvider = UserContext.Provider

export function reducer (state, action) {
  let newState
  switch (action.action) {
    case 'SET':
      newState = { ...state }
      newState[action.name] = action.value
      return newState
    default:
      return state
  }
}

export default UserContext
