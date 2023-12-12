// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, doc,getDocs, setDoc,getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"
import { getStorage, ref, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
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
const storage = getStorage();

auth.onAuthStateChanged(user => {
  console.log(user);
  if (user)
      window.location = "/SmartdeskFrontend/"
})
const video = document.getElementById('video');


Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('./scripts/public/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('./scripts/public/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./scripts/public/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./scripts/public/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./scripts/public/models')
]).then(Webcam).then(faceRecognition);

function Webcam(){
  navigator.mediaDevices.getUserMedia({
    "video":true,
    audio:false
  }).then((stream)=>{
    video.srcObject = stream;

  }).catch((error) => {
    console.error(error)
  })
}

async function getLabel(){
  const array =[];
  const data = collection(db,"labels");
  const snapshot = await getDocs(data)
  let i = 0;
  snapshot.forEach((doc) =>{
    array[i] = doc.data();
    i++;
  })
  return array;
}

async function getLabelFace(){
  const labels =await getLabel();
  return Promise.all(
      labels.map(async(label)=> {
        const descriptions = []
        for (let i=1; i<=label.sample;i++){
          const imgRef = ref(storage,`Labels/${label.uid}/${i}.jpg`);
          getDownloadURL(imgRef)
            .then(async (url) => {
              // Insert url into an <img> tag to "download"
              const image = await faceapi.fetchImage(url)
          
              const detections = await faceapi
                .detectSingleFace(image)
                .withFaceLandmarks()
                .withFaceDescriptor();
              
              descriptions.push(detections.descriptor);
            })
            .catch((error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/object-not-found':
                  // File doesn't exist
                  break;
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;
                case 'storage/canceled':
                  // User canceled the upload
                  break;

                // ...

                case 'storage/unknown':
                  // Unknown error occurred, inspect the server response
                  break;
              }
            });
         
        }
        return new faceapi.LabeledFaceDescriptors(label.uid, descriptions)
      })
    );
}
async function faceRecognition(){
  const LabeledFaceDescriptors = await getLabelFace();
  const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors);
  console.log('test1')
  video.addEventListener("play", ()=>{
    console.log('test2')
    document.getElementById('video-text').innerHTML ='Checking for face...';
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {width:video.width, height:video.height}
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async ()=>{
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections,displaySize);

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      
      const results = resizedDetections.map((d)=>{

        return faceMatcher.findBestMatch(d.descriptor);

      })
      results.forEach(async(result,i) => {
        if (result._label!='unknown'){
          document.getElementById('video-text').innerHTML='User detected';
          const data = await getDoc(doc(db,"labels",result._label));
          if (data.exists()){
            setPersistence(auth, browserSessionPersistence)
            const userCred = await signInWithEmailAndPassword(auth, data.data().email, data.data().password)
          }
        }
        else document.getElementById('video-text').innerHTML='No user detected'
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box);
        drawBox.draw(canvas);
      })
    }, 100);

  })
}
