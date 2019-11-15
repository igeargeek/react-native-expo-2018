import getFirebaseClient from './getClient'

const { firebase } = getFirebaseClient()

export default firebase.auth();