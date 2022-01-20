import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"

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

const db = getFirestore(firebaseApp, {})
const rtdb = getDatabase(firebaseApp)
export { db, rtdb }