import getFirebaseClient from './getClient'

const register = (email, password) => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export default register