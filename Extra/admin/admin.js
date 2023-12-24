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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
var userInfo = {};
auth.onAuthStateChanged(user => {
    if (!user)
        window.location = "/SmartdeskFrontend/login";
    const docRef = doc(db, "users-info",user.uid);
    const docSnap =getDoc(docRef).then(doc => {
        if (doc.exists()) {
            console.log(doc.data()['name'])
            userInfo.name = doc.data()['name'];
            userInfo.id = doc.data()['id'];
            userInfo.email = user.email;
            userInfo.uid = user.uid
            userInfo.seat = doc.data()['seat'];
            userInfo.phone = doc.data()['phone'];
            userInfo.profileURL=doc.data()['profileURL'];
            userInfo.address = doc.data()['address'];
            userInfo.type = user.auth.persistenceManager.persistence.type;
            document.getElementById('username').innerHTML = userInfo.name;
            document.getElementById('userid').innerHTML = userInfo.id;
        } else {
            console.log("Can't find user!");
        }
        })
})

var TotalStudent = 0;
const querySnapshot = await getDocs(collection(db, "users-info"));
querySnapshot.forEach((doc) => {
  document.body.style="display:block";
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  TotalStudent++;
  var temp;
  var tableContent = document.createElement('tr');
  var checkBox = document.createElement('td');
  temp = document.createElement('input');
  temp.type = 'checkbox';
  checkBox.appendChild(temp);
  var STT = document.createElement('td');
  STT.innerHTML='1';
  var name = document.createElement('td');
  name.innerHTML=doc.data().name;
  var id = document.createElement('td');
  id.innerHTML=doc.data().id;
  var phone = document.createElement('td');
  phone.innerHTML=doc.data().phone;
  var email = document.createElement('td');
  email.innerHTML=doc.data().email;
  tableContent.appendChild(checkBox);
  tableContent.appendChild(STT);
  tableContent.appendChild(name);
  tableContent.appendChild(id);
  tableContent.appendChild(phone);
  tableContent.appendChild(email);
  document.getElementById('table').appendChild(tableContent);
  document.getElementById('sltv').innerHTML='Số lượng thành viên: ' + TotalStudent;
});


function updateCount() {
    var checkboxes = document.querySelectorAll('.table-container input[type="checkbox"]');
    var checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    var countText = 'Số lượng thành viên: ' + checked + '/' + checkboxes.length;
    document.getElementById('sltv').innerText = countText;
}

// Gắn sự kiện click vào tất cả các checkbox
document.querySelectorAll('.table-container input[type="checkbox"]').forEach(function(checkbox) {
    checkbox.addEventListener('click', updateCount);
});

// Cập nhật số lượng khi trang tải xong
window.onload = updateCount;
