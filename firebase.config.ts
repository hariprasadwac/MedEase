// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZSGNB56xBRs9amJotdAlclGGbnqbH47g",
  authDomain: "medease-ee7cd.firebaseapp.com",
  projectId: "medease-ee7cd",
  storageBucket: "medease-ee7cd.firebasestorage.app",
  messagingSenderId: "140167553036",
  appId: "1:140167553036:web:c8ae97b5e45fcbee8f8e29",
  measurementId: "G-C02440V3KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);