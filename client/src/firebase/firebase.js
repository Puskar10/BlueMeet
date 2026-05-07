// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgFjLi8jWEtoy-EcuafsirWw4wHCJRzlc",
  authDomain: "bluemeet-8b7f6.firebaseapp.com",
  projectId: "bluemeet-8b7f6",
  storageBucket: "bluemeet-8b7f6.firebasestorage.app",
  messagingSenderId: "121925639319",
  appId: "1:121925639319:web:f9a3f56604a14c41155dd2",
  measurementId: "G-DL5GETMP7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);