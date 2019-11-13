import getFirebaseClient from './getClient'

const logout = (email, password) =>
  new Promise((resolve, reject) => {
    const { firebase } = getFirebaseClient()
  })

export default logout