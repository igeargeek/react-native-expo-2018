import getFirebaseClient from './getClient'

const getOnce = (doc) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  return database.ref(doc)
}

export default getOnce