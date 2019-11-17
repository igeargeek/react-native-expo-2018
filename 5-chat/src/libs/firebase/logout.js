import getFirebaseClient from './getClient'

const logout = () => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().signOut()
}

export default logout