// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, doc,getDocs, setDoc,getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWcOr7SsFnbzgbRBrpyWzXl9mEgKtIgrM",
    authDomain: "uitfarmerclass.firebaseapp.com",
    projectId: "uitfarmerclass",
    storageBucket: "uitfarmerclass.appspot.com",
    messagingSenderId: "603995142746",
    appId: "1:603995142746:web:417413652766ab9906f663",
    measurementId: "G-CJEW8BHZ4C"
};
const userInfo={};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


const data = await  collection(db, "seat-data");
auth.onAuthStateChanged(user => {
    console.log(user);
    if (!user)
        window.location = "/SmartdeskFrontend/login"
        const docRef = doc(db, "users-info",user.uid);
        const docSnap =getDoc(docRef).then(doc => {
            if (doc.exists()) {
                console.log(doc.data()['name'])
                userInfo.name = doc.data()['name'];
                userInfo.id = doc.data()['id'];
                userInfo.email = user.email;
                userInfo.uid = user.uid
                userInfo.seat = doc.data()['seat'];
                userInfo.type = user.auth.persistenceManager.persistence.type;
                document.getElementById('Username').innerHTML = userInfo.name;
                document.getElementById('Userid').innerHTML = userInfo.id;
                document.getElementById('Username2').innerHTML = userInfo.name;
                document.getElementById('Userid2').innerHTML = userInfo.id;
            } else {
                console.log("Can't find user!");
            }
        })
})