// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3FgMGDaGWp8xMFhSfgHbXEzj8_MqG5Ps",
  authDomain: "librastech.firebaseapp.com",
  projectId: "librastech",
  storageBucket: "librastech.firebasestorage.app",
  messagingSenderId: "1045784422597",
  appId: "1:1045784422597:web:b9d1c8420509792c3968ac"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export { app };
