import { initializeApp, getApps } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBZHVq70uDVkDf0hofklzv69lkRXQ05tB4",
    authDomain: "savedblocks.firebaseapp.com",
    databaseURL: "https://savedblocks-default-rtdb.firebaseio.com",
    projectId: "savedblocks",
    storageBucket: "savedblocks.appspot.com",
    messagingSenderId: "586627606863",
    appId: "1:586627606863:web:1c2ccc5a653709c4707d3a"  
}

const apps = getApps()
let firebaseApp
if (!apps.length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = apps[0]
}

const provider = new GoogleAuthProvider();
const auth = getAuth();

// signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     console.log(user);
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });

// auth.onAuthStateChanged(user => {
//     this.$store.commit('updateUser',{ user })
// })

const db = getFirestore(firebaseApp, {})
export { db }