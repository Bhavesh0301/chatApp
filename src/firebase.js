import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCrqVzQrEMa6gUbEaFSnlluec0lZgmVHyQ",
    authDomain: "whatsapp-dec3f.firebaseapp.com",
    projectId: "whatsapp-dec3f",
    storageBucket: "whatsapp-dec3f.appspot.com",
    messagingSenderId: "59509662058",
    appId: "1:59509662058:web:0028480cae23d9beb0c513",
    measurementId: "${config.measurementId}",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
