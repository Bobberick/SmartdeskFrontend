// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, doc,getDocs, setDoc,getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"
import { getStorage, ref, getDownloadURL, uploadBytes   } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
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
const storage = getStorage();

function handleFile(e){
    var files = e.target.files;
    const storageRef = ref(storage,'customProfilePic/customPic');
    uploadBytes(storageRef, files[0]).then((snapshot) => {
        getDownloadURL(ref(storage,'customProfilePic/customPic')).then(async(url)=>{
            await setDoc(doc(collection(db,"users-info"), userInfo.uid), {
                'email':userInfo.email,
                'id':userInfo.id,
                'name':userInfo.name,
                'seat':userInfo.seat,
                'profileURL':url,
                'phone':userInfo.phone,
                'address':userInfo.address
            })
            document.getElementById('userProfilePic').src=url;
            document.getElementById('userProfilePic2').src=url;
        })
        console.log('Uploaded a blob or file!');
    });
    console.log(files[0])
}

const dropContainer=document.getElementById('fromDevice');
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
    evt.preventDefault();
  };
  
  dropContainer.ondrop = function(evt) {
    evt.preventDefault();
    myFile.files = evt.dataTransfer.files;
    let exts = myFile.files[0].name.split('.')[1];
    console.log(exts);
    if (exts != 'jpg' &&
        exts != 'png' &&
        exts != 'gif') return;
    const storageRef = ref(storage,'customProfilePic/customPic');
    uploadBytes(storageRef, myFile.files[0]).then((snapshot) => {
        getDownloadURL(ref(storage,'customProfilePic/customPic')).then(async(url)=>{
            await setDoc(doc(collection(db,"users-info"), userInfo.uid), {
                'email':userInfo.email,
                'id':userInfo.id,
                'name':userInfo.name,
                'seat':userInfo.seat,
                'profileURL':url,
                'phone':userInfo.phone,
                'address':userInfo.address
            })
            document.getElementById('userProfilePic').src=url;
            document.getElementById('userProfilePic2').src=url;
        })
        console.log('Uploaded a blob or file!');
        dialog.close();
    });
    console.log(myFile.files[0])
  };


document.getElementById('myFile').addEventListener('change',handleFile);
const dialog = document.getElementById('modal')
for (let i=1;i<=4;i++){
    const imgRef = ref(storage,`defaultProfilePic/${i}.png`)
    getDownloadURL(imgRef).then(async(url)=>{
        const imgContainer = document.createElement('img');
        imgContainer.classList.add('imageProfile');
        imgContainer.setAttribute('width','75px');
        imgContainer.setAttribute('height','75px');
        imgContainer.style='margin:2px'
        imgContainer.src = url;
        imgContainer.addEventListener('click',async()=>{
            await setDoc(doc(collection(db,"users-info"), userInfo.uid), {
                'email':userInfo.email,
                'id':userInfo.id,
                'name':userInfo.name,
                'seat':userInfo.seat,
                'profileURL':url,
                'phone':userInfo.phone,
                'address':userInfo.address
            })
            document.getElementById('userProfilePic').src=url;
            document.getElementById('userProfilePic2').src=url;
            dialog.close();
        })
        document.getElementById('fromDB').appendChild(imgContainer);
    })
}
const data = await  collection(db, "seat-data");
auth.onAuthStateChanged(user => {
    console.log(user);
    if (!user)
        window.location = "/SmartdeskFrontend/login"
        const docRef = doc(db, "users-info",user.uid);
        const docSnap =getDoc(docRef).then(doc => {
            if (doc.exists()) {
                document.body.style='display:block'
                userInfo.name = doc.data()['name'];
                document.getElementById('username').setAttribute('value',doc.data()['name'])
                userInfo.id = doc.data()['id'];
                document.getElementById('id').setAttribute('value',doc.data()['id'])
                userInfo.email = user.email;
                document.getElementById('email').setAttribute('value',doc.data()['email'])
                userInfo.uid = user.uid
                userInfo.seat = doc.data()['seat'];
                userInfo.profile=user.profileURL;
                userInfo.type = user.type;
                userInfo.profileURL = doc.data()['profileURL'];
                userInfo.phone = doc.data()['phone'];
                document.getElementById('phone').setAttribute('value',doc.data()['phone'])
                userInfo.address = doc.data()['address'];
                document.getElementById('address').setAttribute('value',doc.data()['address'])
                if (userInfo.profileURL){
                    document.getElementById('userProfilePic').src=userInfo.profileURL;
                    document.getElementById('userProfilePic2').src=userInfo.profileURL;
                }
                document.getElementById('Username').innerHTML = userInfo.name;
                document.getElementById('Userid').innerHTML = userInfo.id;
                document.getElementById('Username2').innerHTML = userInfo.name;
                document.getElementById('Userid2').innerHTML = userInfo.id;
            } else {
                console.log("Can't find user!");
            }
        })
})
document.getElementById('changeImageLink').addEventListener('click',()=>{
    dialog.showModal();
})
function onClick(e) {
    if (e.target === modal) {
        dialog.close();
    }
}
dialog.addEventListener("click",onClick)

document.getElementById('byDB').addEventListener('click',()=>{
    document.getElementById('fromDB').style="display:flex";
    document.getElementById('fromDevice').style="display:none";
})
document.getElementById('byDevice').addEventListener('click',()=>{
    document.getElementById('fromDevice').style="display:flex";
    document.getElementById('fromDB').style="display:none";
})

document.getElementById('submitButton').addEventListener('click',async (e)=>{
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const id = document.getElementById('id').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    await setDoc(doc(collection(db,"users-info"), userInfo.uid), {
        'email':email,
        'id':id,
        'name':username,
        'seat':userInfo.seat,
        'profileURL':userInfo.profileURL,
        'phone':phone,
        'address':address
    })
    document.getElementById('Username').innerHTML = username;
    document.getElementById('Userid').innerHTML = id;
    document.getElementById('Username2').innerHTML = username;
    document.getElementById('Userid2').innerHTML = id;
})