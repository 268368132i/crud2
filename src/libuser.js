import { apiUrl } from './settings'

export function getUsers (dispatcher) {
  console.log("Dispatcher: ", dispatcher)
  dispatcher({action: "SET", element: "test", value: "getUsersTest"})
  async function runFetch () {
    dispatcher({ action: 'ERROR', value: false })
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await fetch(apiUrl + '/user/')
          if (data.status > 299) {
            throw new Error('Server returned error')
          }
          dispatcher({ action: 'PENDING', value: false })
          dispatcher({ action: 'SET', element: 'users', value: await data.json() })
          resolve()
        } catch (err) {
          console.log(String(err))
          dispatcher({ action: 'PENDING', value: false })
          dispatcher({ action: 'ERROR', value: err })
          reject(err)
        }
      })
    })
  }
  runFetch()
}

export function create (userFields, formDispatcher, onSuccess = () => {}) {
  const runFetch = async () => {
    formDispatcher({ action: 'ERROR', value: false })
    formDispatcher({ action: 'PENDING', value: true })
    try {
      const ret = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const fr = await fetch(
              apiUrl + '/user/new',
              {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(userFields)
              })
            if (!fr.ok) {
              console.log('User create. REsponse:', fr)
              throw new Error('Server returned error')
            }
            formDispatcher({ action: 'PENDING', value: false })
            onSuccess()
            resolve(await fr.json())
          } catch (err) {
            reject(err)
          }
        }, 1000)
      })
    } catch (err) {
      console.log(`Error creating user: ${String(err)}`)
      formDispatcher({ action: 'PENDING', value: false })
      formDispatcher({ action: 'ERROR', value: err })
    }
  }
  runFetch()
}
