import getFirebaseClient from './getClient'

const pushDatabase = async (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  await database.ref(doc).push(data)
}

export default pushDatabase