import * as firebase from 'firebase';

let initFirebase
const firebaseConfig = {
  apiKey: "AIzaSyDUVrpigabKpinbpmTHIyvayAoGXiPCbEI",
  authDomain: "react-native-workshop-bc321.firebaseio.com",
  databaseURL: "https://react-native-workshop-bc321.firebaseio.com/",
  storageBucket: "react-native-workshop-bc321.appspot.com"
}

const getClient = () => {
  if (!initFirebase) {
    initFirebase = firebase.initializeApp(firebaseConfig);
  }
  return { initFirebase, firebase }
}

export default getClient