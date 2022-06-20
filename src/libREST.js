import { useReducer } from "react";
import {apiUrl} from './settings'

export class Model {
    constructor (endPointSuffix) {
        this.suffix = endPointSuffix
        const [state, dispatcher] = useReducer(this.getReducer(),{})
        this.setState(state)
        this.setDispatcher(dispatcher)
    }

    setState(state) {
        this.state = state;
    }
    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher
    }

    getStateAndDispatcher(){
        return [this.state, this.dispatcher]
    }

    async getMany(query){
        try {
            this.dispatcher({
                action: 'START'
            })
            const data = await fetch(apiUrl + '/' + this.suffix/* +
              query ? ('?' + new URLSearchParams(query)) : ''*/)
            if (data.status !== 200) throw new Error('Server returned error')
            const json = await data.json()
            this.dispatcher({
                action: 'FINISH',
                element: this.suffix + 'List',
                value: json
            })
          } catch (err) {
            console.log(err)
            this.dispatcher({
                action: 'ERROR',
                value: err
            })
        }
    }
    getReducer(customActions = []) {
        const stdActions = new Array()
        
          stdActions["SET"] = (state, action) => {
            return { ...state, [action.element]: action.value }
          }
          stdActions["START"] = (state, action) => {
            return { ...state, pending: true, error: false }
          }
          stdActions["FINISH"] = (state, action) => {
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
}