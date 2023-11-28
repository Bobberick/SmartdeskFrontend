// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const loginForm = document.querySelector('#login-form')
const loginBtn = document.getElementById('login-button');
const loginWithEmailPassword = async () => {
    var remember = document.getElementById('remember');
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    try {
        if (remember.checked) {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
        }
        else {
            setPersistence(auth, browserSessionPersistence)
            const userCred = await signInWithEmailAndPassword(auth, email, password)
        }
    }
    catch (error) {
        console.log('test');
        const warningText = document.getElementById('warning-text');
        warningText.innerHTML = 'Thông tin đăng nhập sai, vui lòng thử lại!';

    }
}
loginBtn.addEventListener('click', loginWithEmailPassword)
auth.onAuthStateChanged(user => {
    console.log(user);
    if (user)
        window.location = "/SmartdeskFrontend/"
})