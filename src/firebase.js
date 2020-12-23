import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsS0KQwzkOJzPwSuyXgwXYdn-sbYvQ--E",
  authDomain: "slack-f1aba.firebaseapp.com",
  projectId: "slack-f1aba",
  storageBucket: "slack-f1aba.appspot.com",
  messagingSenderId: "203899993075",
  appId: "1:203899993075:web:fd745fca2118c23dc37086",
  measurementId: "G-1VT0H61KE0"
};

firebase.initializeApp(firebaseConfig);

export default firebase;