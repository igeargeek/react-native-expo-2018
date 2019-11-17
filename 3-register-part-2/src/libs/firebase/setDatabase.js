import getFirebaseClient from './getClient'

const setDatabase = async (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  await database.ref(doc).set(data)
}

export default setDatabase