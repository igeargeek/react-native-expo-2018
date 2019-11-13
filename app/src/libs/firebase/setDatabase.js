import getFirebaseClient from './getClient'

const setDatabase = (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  database.ref(doc).set(data)
}

export default setDatabase