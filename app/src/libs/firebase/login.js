import getFirebaseClient from './getClient'

const login = (email, password) => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export default login