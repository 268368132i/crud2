import { Model, getReducer } from "../lib/libREST";
import { apiUrl } from "../settings";

export default class AuthModel extends Model {
    constructor (){
        super('auth')
    }
    login(credentials, authDispatcher) {
        return this.create(credentials, (action) => {
          switch (action.action) {
            case 'START':
              authDispatcher(action)
              return
            case 'FINISH':
              authDispatcher({
                action: 'login',
                value: action.value
              })
              return
            case 'ERROR':
              authDispatcher(action)
              return
          }
          authDispatcher
        })
    }
    async logout(authDispatcher){
        try {
            authDispatcher({
              action: 'START'
            })
            const ret = await fetch(apiUrl + '/' + this.suffix, {
              method: 'DELETE',
              headers: { 'content-type': 'application/json' }
            })
            if (ret.status !== 200) throw new Error('Server returned error')
            authDispatcher({
              action: 'logout'
            })
            return
          } catch (err) {
            console.log(String(err))
            authDispatcher({
              action: 'ERROR',
              value: err
            })
          }
    }
}

export const authModel = new AuthModel()

//Custom actions for authReducer
const custActions = {
  login: (state, action)  => {
    console.log('Login action has been called')
    return {
      ...state,
      ...action.value.user,
      pending: false,
      authenticated: true,
      error: false,
      password: '',
    }
  },
  logout: (state, action) => {
    return {
      ...state,
       pending: false, 
       authenticated: false, 
       error: false, 
       _id: false,
      }
  }
}
export const authReducer = getReducer(custActions)
