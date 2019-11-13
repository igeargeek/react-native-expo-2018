import getFirebaseClient from './getClient'

const onAuthStateChanged = (email, password) =>
    new Promise((resolve, reject) => {
        const { firebase } = getFirebaseClient()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
        })
    })

export default onAuthStateChanged