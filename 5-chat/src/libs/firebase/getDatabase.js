import getFirebaseClient from './getClient'

const getDatabase = (doc, callback) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  database.ref(doc).on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(data)
    }
  })
}

export default getDatabase