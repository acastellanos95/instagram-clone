import firebase from 'firebase';

const Firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyCZmHV5va9p39tFKK1zsEpRbgLS5LQYJVA",
    authDomain: "instagram-clone-8ac83.firebaseapp.com",
    databaseURL: "https://instagram-clone-8ac83.firebaseio.com",
    projectId: "instagram-clone-8ac83",
    storageBucket: "instagram-clone-8ac83.appspot.com",
    messagingSenderId: "876916263293",
    appId: "1:876916263293:web:b97880811b8834df1fa414",
    measurementId: "G-6PTCC42H05"
  });

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};