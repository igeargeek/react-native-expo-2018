import * as firebase from 'firebase';

let initFirebase
const firebaseConfig = {
    apiKey: "AIzaSyCRIrsbOmaxtCoIy_l0bIc3gmYWVObHEkE",
    authDomain: "igg-chat-app.firebaseio.com",
    databaseURL: "https://igg-chat-app-f3c73.firebaseio.com",
    storageBucket: "igg-chat-app-f3c73.appspot.com"
};

const getClient = () => {
    if (!initFirebase) {
        initFirebase = firebase.initializeApp(firebaseConfig);
    }
    return { initFirebase, firebase }
}

export default getClient