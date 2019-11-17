import getFirebaseClient from './getClient'

const onAuthStateChanged = () =>{
    return new Promise((resolve, reject) => {
        const { firebase } = getFirebaseClient()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user)
            } else {
                reject(null)
            }
        })
    })
}

export default onAuthStateChanged