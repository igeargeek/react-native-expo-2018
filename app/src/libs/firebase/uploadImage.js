

import getFirebaseClient from './getClient'

const uploadImage = async(uri) => {
    const { firebase } = getFirebaseClient()

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref("images/profiles").child(`${new Date().getTime()}.jpg`);
    let urlImage
    await ref.put(blob).then(() => {
        urlImage =  ref.getDownloadURL()
    });

    return urlImage

}

export default uploadImage