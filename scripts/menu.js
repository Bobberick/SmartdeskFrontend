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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


const data = collection(db, "seat-data");

var userInfo = {};

auth.onAuthStateChanged(user => {
    console.log(user);
    if (!user)
        window.location = "/SmartdeskFrontend/login"
    const docRef = doc(db, "users-info",user.uid);
    const docSnap =getDoc(docRef).then(doc => {
        document.getElementsByClassName('page-wrapper')[0].style.display = 'flex';
        if (doc.exists()) {
            console.log(doc.data()['name'])
            userInfo.name = doc.data()['name'];
            userInfo.id = doc.data()['id'];
            userInfo.email = user.email;
            userInfo.uid = user.uid
            userInfo.seat = doc.data()['seat'];
            document.getElementById('Username').innerHTML = userInfo.name;
            document.getElementById('Userid').innerHTML = userInfo.id;
        } else {
            console.log("Can't find user!");
        }
    })

    for (let i = 0; i <= 35; i++) {
        let seatPtr = document.getElementById('seat' + i);
        const test = onSnapshot(doc(data, "seat" + i), (doc) => {
            let Table = document.getElementById(doc.id);
            let Availability = doc.data()["status"];
            if (Availability == "Unavailable") {
                while (Table.firstChild)
                    Table.removeChild(Table.lastChild);
                Table.innerHTML = "Unavailable";
                Table.setAttribute("style", "background-color:red");
            }
            else {
                Table.innerHTML = '';
                let name = document.createElement('span')
                if (doc.data()["owner"] != userInfo.id) {
                    name.innerHTML = doc.data()["owner"];
                }
                else name.innerHTML = "YOU";
                Table.appendChild(name);
                if (doc.data()["owner"] == "none")
                    Table.setAttribute("style", "background-color:gray");
                else {
                    let temp = document.createElement('span')
                    temp.innerHTML = doc.data()["type"];
                    temp.setAttribute("style", "font-size:0.5rem");
                    Table.appendChild(temp);
                    if (doc.data()["type"] == "Online")
                        Table.setAttribute("style", "background-color:#fcc49c");
                    else
                        Table.setAttribute("style", "background-color:#6eb575");
                }
            }

        })
    }

})


document.getElementById('Signout').addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('LOG OUT');
    });
})

 
//Modal
{
    const HomeButton = document.getElementById('Home');
    const ProductButton = document.getElementById('Product');
    const CommunityButton = document.getElementById('Community');
    const AboutButton = document.getElementById('About');
    const UserInfo = document.getElementById('profile')

    function openModal(buttonE) {
        let modal = document.getElementById('modal'+buttonE.id);
        buttonE.addEventListener('click', e => {
            document.getElementById('table-box').setAttribute('style', 'z-index:-10');
            let width = HomeButton.offsetWidth;
            modal.setAttribute('style', 'width:' + buttonE.offsetWidth + 'px; margin-left:' + buttonE.offsetLeft + 'px')
            modal.show();
        })
        buttonE.addEventListener('mouseleave', e => {
            document.getElementById('table-box').setAttribute('style', 'z-index:none');
            modal.close();
        })

        modal.addEventListener('mouseover', () => {
            document.getElementById('table-box').setAttribute('style', 'z-index:-10');
            modal.show();
        })

        modal.addEventListener('mouseleave', () => {
            modal.close();
            document.getElementById('table-box').setAttribute('style', 'z-index:none'); })
    }

    openModal(HomeButton);
    openModal(ProductButton);
    openModal(CommunityButton);
    openModal(AboutButton);
    openModal(UserInfo);


}

{
    
    let items = document.querySelectorAll('.seat');
    let modal = document.getElementById('modal');
    let OnButton = document.getElementById('OnButton');
    let OffButton = document.getElementById('OffButton')
    let confirm = document.getElementById('confirm-box');
    let seatX = 0;
    let seatY = 0;
    let seatID;
    let validSeat;
    let seatIsOwned = false;
    items.forEach(fe);
    var mousePos = {};
    function onClick(e) {
        if (e.target === modal) {
            modal.close();
        }
    }

    OffButton.addEventListener('click', () => {
        OnButton.classList.remove('selected');
        OffButton.classList.toggle('selected');
    })
    OnButton.addEventListener('click', () => {
        OffButton.classList.remove('selected');
        OnButton.classList.toggle('selected');
    })
    document.getElementById('close').addEventListener('click', (e) => {
        confirm.close();
        confirm.style.display = "none";
    })
    document.getElementById('RegButton').addEventListener('click', async (e) => {
        if (validSeat) {
            if (OffButton.classList.contains('selected')) {
                confirm.showModal();
                confirm.style.display = "flex";
                document.getElementById('confirm-table').innerHTML = 'Table: ' + seatX + ',' + seatY;
                document.getElementById('confirm-mode').innerHTML = 'Mode: Offline';
                await setDoc(doc(data, seatID), {
                    "owner": userInfo.id,
                    "owner-name": userInfo.name,
                    "seat-id": Number(seatID.match(/\d+/)[0]),
                    "status": "Available",
                    "type": "Offline",
                    "email": userInfo.email
                })
                await setDoc(doc(db, "users-info", userInfo.uid), {
                    "email": userInfo.email,
                    "id": userInfo.id,
                    "name": userInfo.name,
                    "seat": seatID,
                })
                userInfo.seat = seatID;
                modal.close();
            }
            else if (OnButton.classList.contains('selected')) {
                confirm.showModal();
                confirm.style.display = "flex";
                document.getElementById('confirm-table').innerHTML = 'Table: ' + seatX + ',' + seatY;
                document.getElementById('confirm-mode').innerHTML = 'Mode: Online';
                await setDoc(doc(data, seatID), {
                    "owner": userInfo.id,
                    "owner-name": userInfo.name,
                    "seat-id": Number(seatID.match(/\d+/)[0]),
                    "status": "Available",
                    "type": "Online",
                    "email": userInfo.email
                })
                await setDoc(doc(db, "users-info", userInfo.uid), {
                    "email": userInfo.email,
                    "id": userInfo.id,
                    "name": userInfo.name,
                    "seat": seatID,
                })
                userInfo.seat = seatID;
                modal.close();
            }
            else {

            }
        }
    })

    document.getElementById('CancelButton').addEventListener('click', async (e) => {
        console.log(seatIsOwned)
        if (seatIsOwned) {
            await setDoc(doc(data, seatID), {
                "owner": 'none',
                "owner-name": 'none',
                "seat-id": Number(seatID.match(/\d+/)[0]),
                "status": "Available",
                "type": "Offline",
                "email": 'none'
            })
            await setDoc(doc(db, "users-info", userInfo.uid), {
                "email": userInfo.email,
                "id": userInfo.id,
                "name": userInfo.name,
                "seat": 'none',
            })
            userInfo.seat = "none";
        }
    })

    modal.addEventListener('click', onClick)
    
    function fe(item, index) {
        item.addEventListener("click", (e) => {
            seatID = item.id;
            validSeat = false;
            seatIsOwned = false;
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
            modal.style.left = mousePos.x + "px";
            modal.style.top = mousePos.y + "px";
            if (item.innerHTML != "Unavailable") {
                let docRefs = doc(data, item.id) //table data
                let docSnap = onSnapshot(docRefs,(docSnap) => {
                    if (docSnap.exists()) {
                        if (docSnap.data()['owner'] != 'none') {
                            document.getElementById('modal-id').innerHTML = docSnap.data()['owner'];
                        }
                        else { document.getElementById('modal-id').innerHTML = 'Id'; validSeat = true; }
                        if (docSnap.data()['owner-name'] != 'none')
                            document.getElementById('modal-name').innerHTML = docSnap.data()['owner-name'];
                        else document.getElementById('modal-name').innerHTML = 'Name';
                        let seatid = docSnap.data()['seat-id'];
                        let seatgroup = ((seatid - (seatid % 12)) / 12);
                        seatX = seatgroup * 2 + seatid % 2 + 1;
                        seatY = ((seatid % 12) - (seatid % 12) % 2) / 2 + 1;
                        if (seatY > 3) modal.style.transform = "translateY(-100%)";
                        else modal.style.transform = modal.style.transform = "";

                        document.getElementById('tableid').innerHTML = 'Table ' + seatX + "," + seatY;
                        document.getElementById('tableid2').innerHTML = 'Table: ' + seatX + "," + seatY;
                        document.getElementById('tabletype').innerHTML = 'Mode: ' + docSnap.data()['type'];
                        document.getElementById('tablemail').innerHTML = 'Email: ' + docSnap.data()['email'];

                        if (docSnap.data()['owner'] != 'none') {
                            document.getElementById('OffButton').style.display = 'none';
                            document.getElementById('OnButton').style.display = 'none';
                            document.getElementById('RegButton').style.display = 'none';
                            if (docSnap.data()['owner'] == userInfo.id) {
                                seatIsOwned = true;
                                document.getElementById('CancelButton').style.display = '';
                            }
                            else {
                                document.getElementById('CancelButton').style.display = 'none';
                            }
                            document.getElementById('tableid').style.display = 'none';
                            document.getElementById('tablemode').style.display = 'none';
                            document.getElementById('tableinfo').style.display = '';
                            document.getElementById('profileModal').style.borderBottom = '2px lightgreen solid';
                            document.getElementById('profileModal').style.paddingBottom = '0.5rem';
                        } else {
                            document.getElementById('OffButton').style.display = '';
                            document.getElementById('OnButton').style.display = '';
                            document.getElementById('RegButton').style.display = '';
                            document.getElementById('CancelButton').style.display = 'none';
                            document.getElementById('tableid').style.display = '';
                            document.getElementById('tablemode').style.display = '';
                            document.getElementById('tableinfo').style.display = 'none';
                            document.getElementById('profileModal').style.borderBottom = '';
                            document.getElementById('profileModal').style.paddingBottom = '';
                        }
                    } else {
                        console.log("No such document!");
                    }
                })
                OffButton.classList.remove('selected');
                OnButton.classList.remove('selected');
                if (userInfo.seat != 'none' && item.innerHTML == '<span>none</span>') { validSeat = false;} else
                    modal.showModal();                
            }
        });
    }
}

//Calender initialize
{
    let date = new Date;
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay = firstDay.getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay = lastDay.getDate();
    switch (date.getMonth()) {
        case 0:
            document.getElementById('monthN').innerHTML = 1;
            document.getElementById('monthL').innerHTML = 'January';
            break;
        case 1:
            document.getElementById('monthN').innerHTML = 2;
            document.getElementById('monthL').innerHTML = 'Febuary';
            break;
        case 2:
            document.getElementById('monthN').innerHTML = 3;
            document.getElementById('monthL').innerHTML = 'March';
            break;
        case 3:
            document.getElementById('monthN').innerHTML = 4;
            document.getElementById('monthL').innerHTML = 'January';
            break;
        case 4:
            document.getElementById('monthN').innerHTML = 5;
            document.getElementById('monthL').innerHTML = 'May';
            break;
        case 5:
            document.getElementById('monthN').innerHTML = 6;
            document.getElementById('monthL').innerHTML = 'June';
            break;
        case 6:
            document.getElementById('monthN').innerHTML = 7;
            document.getElementById('monthL').innerHTML = 'July';
            break;
        case 7:
            document.getElementById('monthN').innerHTML = 8;
            document.getElementById('monthL').innerHTML = 'August';
            break;
        case 8:
            document.getElementById('monthN').innerHTML = 9;
            document.getElementById('monthL').innerHTML = 'September';
            break;
        case 9:
            document.getElementById('monthN').innerHTML = 10;
            document.getElementById('monthL').innerHTML = 'October';
            break;
        case 10:
            document.getElementById('monthN').innerHTML = 11;
            document.getElementById('monthL').innerHTML = 'November';
            break;
        case 11:
            document.getElementById('monthN').innerHTML = 12;
            document.getElementById('monthL').innerHTML = 'December';
            break;
    }
    document.getElementById('year').innerHTML = date.getFullYear();
    const currentDay = date.getDate();
    let day = 0; 
    let outerBox = document.getElementById('calender');
    for (let i = 0; i <= 41; i++) {
        let innerBox = document.createElement('div');
        if (i <= 6) {
            innerBox.setAttribute('class', 'date');
            switch (i) {
                case 0:
                    innerBox.append('Sun');
                    break;
                case 1:
                    innerBox.append('Mon');
                    break;
                case 2:
                    innerBox.append('Tue');
                    break;
                case 3:
                    innerBox.append('Wed');
                    break;
                case 4:
                    innerBox.append('Thu');
                    break;
                case 5:
                    innerBox.append('Fri');
                    break;
                case 6:
                    innerBox.append('Sat');
                    break;
            }
        }
        else {
            innerBox.setAttribute('class', 'date-number');
            if (firstDay != -1 && i % 7 == firstDay) {
                firstDay = -1;
            }
            if (firstDay == -1) {
                day++;
                if (day <= lastDay) {
                    innerBox.append(day);
                    if (day == currentDay) innerBox.setAttribute('style','background-color: red')
                }
            }
        }
        outerBox.appendChild(innerBox);
    }
}