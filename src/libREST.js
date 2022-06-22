import { useReducer } from "react";
import { apiUrl } from './settings'

export class Model {
  constructor(endPointSuffix) {
    this.suffix = endPointSuffix
  }

  async getMany(dispatcher) {
    try {
      dispatcher({
        action: 'START'
      })
      const data = await fetch(apiUrl + '/' + this.suffix/* +
              query ? ('?' + new URLSearchParams(query)) : ''*/)
      if (data.status !== 200) throw new Error('Server returned error')
      const json = await data.json()
      dispatcher({
        action: 'FINISH',
        element: this.suffix + 'List',
        value: json
      })
    } catch (err) {
      console.log(err)
      dispatcher({
        action: 'ERROR',
        value: err
      })
    }
  }
  async getOne(id, dispatcher) {
    try {
      dispatcher({
        action: 'START'
      })
      const data = await fetch(apiUrl + '/' + this.suffix + '/' + id)
      if (data.status !== 200) throw new Error('Server returned error')
      const json = await data.json()
      dispatcher({
        action: 'FINISH',
        element: this.suffix,
        value: json
      })
    } catch (err) {
      console.log(String(err))
      dispatcher({
        action: 'ERROR',
        value: err
      })
    }
  }
  async update(obj, dispatcher) {
    try {
      const id = String(obj._id)
      delete obj._id
      dispatcher({
        action: 'START'
      })
      const ret = await fetch(apiUrl + '/' + this.suffix + '/' + id, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(obj)
      })
      if (ret.status !== 201) throw new Error('Server returned error')
      const json = await ret.json()
      dispatcher({
        action: 'FINISH'
      })
      return json
    } catch (err) {
      console.log(String(err))
      dispatcher({
        action: 'ERROR'
      })
    }
  }

  async create(obj, dispatcher) {
    try {
      dispatcher({
        action: 'START'
      })
      const ret = await fetch(apiUrl + '/' + this.suffix + '/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(obj)
      })
      if (ret.status !== 201) throw new Error('Server returned error')
      const json = await ret.json();
      console.log('Create returned:', json)
      obj._id = json._id
      dispatcher({
        action: 'FINISH',
        value: json
      })
      return json
    } catch (err) {
      console.log(String(err))
      dispatcher({
        action: 'ERROR'
      })
    }
  }

  async delete(id , dispatcher, onSuccess = ()=>{}) {

    try {
      if (typeof id === 'object') {
        id = id._id
      }
      dispatcher({
        action: 'START'
      })
      const ret = await fetch(apiUrl + '/' + this.suffix + '/' + id, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' }
      })
      if (ret.status !== 200) throw new Error('Server returned error')
      dispatcher({
        action: 'FINISH'
      })
      onSuccess()
    } catch (err) {
      console.log(String(err))
      dispatcher({
        action: 'ERROR',
        value: err
      })
    }
  }

}


export function getReducer(customActions = []) {
  const stdActions = new Array()

  stdActions["SET"] = (state, action) => {
    return { ...state, [action.element]: action.value }
  }
  stdActions["START"] = (state, action) => {
    return { ...state, pending: true, error: false }
  }
  stdActions["FINISH"] = (state, action) => {
    if (!action.element) {
      return { ...state, pending: false, error: false }
    }
    return { ...state, [action.element]: action.value, pending: false, error: false }
  }
  stdActions["ERROR"] = (state, action) => {
    return { ...state, pending: false, error: action.value }
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

  const actions = { ...stdActions, ...customActions };
  console.log("StdActions: ", stdActions, " Actions: ", actions, "Custom actions: ", customActions)
  return function (state, action) {
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