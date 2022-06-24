import { apiUrl } from './settings'

const modelName = 'items'

export function reducer (state, action) {
  let newState
  try {
    switch (action.action) {
      case 'SET':
        newState = { ...state }
        newState[action.element] = action.value
        return newState
      case 'SETMANY':
        newState = { ...state, ...action.value }
        return newState
      case 'PENDING':
        newState = { ...state, pending: action.value }
        return newState
      case 'ERROR':
        newState = { ...state, _error: action.value }
        return newState
      default :
        return state
    }
  } catch (err) {
    const newState = { ...state, error: {} }
    newState.error[action.element] = err
    return newState
  }
}

export function getReducer(customActions = []) {
  const stdActions = new Array()
  
    stdActions["SET"] = (state, action) => {
      return { ...state, [action.element]: action.value }
    }
    stdActions["SETMANY"] = (state, action) => {
      return { ...state, ...action.value }
    }
    stdActions["PENDING"] = (state, action) => {
      return { ...state, pending: action.value }
    }
    stdActions["ERROR"] = (state, action) => {
      return { ...state, error: action.value }
    }
  const actions = {...customActions, ...stdActions};
  console.log("StdActions: ", stdActions, " Actions: ", actions, "Custom actions: ", customActions)
  return function (state, action){
    let newState;
    try {
      if (typeof actions[action.action] === "function") {
        return actions[action.action](state, action);
      } else {
        console.log(`Reducer error: invalid action ${action.action}`);
        return state;
      }
    } catch (err) {
      const newState = { ...state, error: {} }
      newState.error[action.element] = err
      return newState
    }
  }
}

export function pendingStateToReducer (dispatcher) {
  return function (pending) {
    dispatcher({ action: 'PENDING', value: pending })
  }
}

export function errorStateToReducer (dispatcher) {
  return function (error) {
    dispatcher({ action: 'ERROR', value: error })
  }
}

export function dataStateToReducer (dispatcher, dataname = 'data') {
  return function (data) {
    dispatcher({ action: 'SET', element: dataname, value: data })
  }
}

export async function getItems () {
  try {
    const result = await new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await fetch(apiUrl + '/' + modelName)
          if (data.status !== 200) throw new Error('Server returned error')
          const json = await data.json()
          resolve(json)
        } catch (err) {
          reject(err)
        }
      }, 500)
    })
    return result
  } catch (err) {
    return null
  }
}

export async function getItem (id) {
  try {
    const result = await new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await fetch(apiUrl + '/' + modelName + '/' + id)
          if (data.status !== 200) throw new Error('Server returned error')
          const json = await data.json()
          resolve(json)
        } catch (err) {
          reject(err)
        }
      }, 1000)
    })
    return result
  } catch (err) {
    return null
  }
}

export function getAndSetItems (setData, setError, setPending) {
  setPending(true)
  getItems()
    .then(data => {
      setData(data)
      setPending(false)
    })
    .catch((err) => {
      setError(err)
      setPending(false)
    })
}

export function getAndSetItem (id, dispatcher, setError, setPending) {
  dispatcher({ action: 'PENDING', value: true })

  getItem(id)
    .then(data => {
      Object.entries(data).forEach((entry) => {
        dispatcher({ action: 'SET', element: entry[0], value: entry[1] })
      })
      dispatcher({ action: 'PENDING', value: false })
    })
    .catch((err) => {
      dispatcher({ action: 'ERROR', value: err })
      dispatcher({ action: 'PENDING', value: false })
    })
}

export function updateItem (item, setPending, setError) {
  console.log('updateItem: setPending:', setPending)
  setError(null)
  const runFetch = async () => {
    try {
      const res = await new Promise((resolve, reject) => {
        setPending(true)
        setTimeout(async () => {
          try {
            const id = String(item._id)
            delete item._id
            const ret = await fetch(apiUrl + '/' + modelName + '/' + id, {
              method: 'PATCH',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(item)
            })
            if (ret.status !== 200) throw new Error('Server returned error')
            setPending(false)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 1000)
      })
    } catch (err) {
      setError(err)
      setPending(false)
    }
  }
  runFetch()
}

export function deleteItem (item, setPending, setError) {
  setError(null)
  const runFetch = async () => {
    try {
      const res = await new Promise((resolve, reject) => {
        setPending(true)
        setTimeout(async () => {
          try {
            const ret = await fetch(apiUrl + '/' + modelName + '/' + item._id, {
              method: 'DELETE',
              headers: { 'content-type': 'application/json' }
            })
            if (ret.status !== 200) throw new Error('Server returned error')
            setPending(false)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 1000)
      })
    } catch (err) {
      setError(err)
      setPending(false)
    }
  }
  runFetch()
}

export function createItem (data, setPending, setError, successCallback = null) {
  setError(false)
  console.log('Creating item')
  const runFetch = async () => {
    try {
      const res = await new Promise((resolve, reject) => {
        setPending(true)
        setTimeout(async () => {
          try {
            const ret = await fetch(apiUrl + '/' + modelName, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(data)
            })
            if (ret.status !== 201) throw new Error('Server returned an error')
            setPending(false)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 1000)
      })
      if (typeof successCallback === 'function') {
        successCallback()
      }
    } catch (err) {
      setPending(false)
      setError(err)
    }
  }
  runFetch()
}
