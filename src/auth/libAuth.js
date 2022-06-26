import { Model } from "../lib/libREST";
import { apiUrl } from "../settings";

export default class AuthModel extends Model {
    constructor (){
        super('auth')
    }
    login(credentials, dispatcher) {
        return this.create(credentials, dispatcher)
    }
    async logout(dispatcher){
        try {
            dispatcher({
              action: 'START'
            })
            const ret = await fetch(apiUrl + '/' + this.suffix, {
              method: 'DELETE',
              headers: { 'content-type': 'application/json' }
            })
            if (ret.status !== 200) throw new Error('Server returned error')
            dispatcher({
              action: 'FINISH'
            })
            return
          } catch (err) {
            console.log(String(err))
            dispatcher({
              action: 'ERROR',
              value: err
            })
          }
    }
}

export const authModel = new AuthModel()
