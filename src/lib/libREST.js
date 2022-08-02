import { useReducer } from "react";
import { apiUrl } from '../settings'

export class Model {
  constructor(endPointSuffix) {
    console.log('REST constructor')
    this.suffix = endPointSuffix
  }


  async getMany(dispatcher) {
    try {
      dispatcher({
        action: 'START'
      })
      const data = await fetch(apiUrl + '/' + this.suffix/* +
              query ? ('?' + new URLSearchParams(query)) : ''*/)
      if (!data.ok) throw {status: data.status, message: data.statusText}
      const json = await data.json()
      dispatcher({
        action: 'FINISH',
        element: 'itemsList',
        value: json
      })
      return true
    } catch (err) {
      console.log(err)
      dispatcher({
        action: 'ERROR',
        value: err
      })
      return false
    }
  }
  async getOne(id, dispatcher) {
    try {
      dispatcher({
        action: 'START'
      })
      const data = await fetch(apiUrl + '/' + this.suffix + '/' + id)
      if (!ret.ok) throw {status: ret.status || 500, message: ret.statusText}
      const json = await data.json()
      dispatcher({
        action: 'FINISH',
        element: this.suffix,
        value: json
      })
      return reue
    } catch (err) {
      console.log(err)
      dispatcher({
        action: 'ERROR',
        value: err
      })
      return false
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
      if (!ret.ok) throw {status: ret.status || 500, message: ret.statusText}
      let json = {}
      try {
        json = await ret.json()
      } catch (emptyErr){
        //Doing nothing, it's OK to have an empty response
      }
      dispatcher({
        action: 'FINISH'
      })
      return json
    } catch (err) {
      console.log(String(err))
      dispatcher({
        action: 'ERROR',
        value: err
      })
      return false
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
      if (!ret.ok) throw {status: ret.status || 500, message: ret.statusText}
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
        action: 'ERROR',
        value: err
      })
      return false
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
      if (!ret.ok) throw {status: ret.status || 500, message: ret.statusText}
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
      return false
    }
  }
}


export function getReducer(customActions = []) {
  
  const stdActions = {
    SET : (state, action) => {
      return { ...state, [action.element]: action.value }
    },
    START : (state, action) => {
      return { ...state, pending: true, error: false }
    },
    FINISH : (state, action) => {
      if (!action.element) {
        return { ...state, pending: false, error: false }
      }
      return { ...state, [action.element]: action.value, pending: false, error: false }
    },
    ERROR : (state, action) => {
      return { ...state, pending: false, error: action.value }
    },
    SETMANY : (state, action) => {
      return { ...state, ...action.value }
    },
    PENDING : (state, action) => {
      return { ...state, pending: action.value }
    },
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