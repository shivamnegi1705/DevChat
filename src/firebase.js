import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAajYg2MTvBke5P0mQ8DxAfXyuHCX1SJE0",
  authDomain: "react-slack-chat-app-clone.firebaseapp.com",
  databaseURL: "https://react-slack-chat-app-clone.firebaseio.com",
  projectId: "react-slack-chat-app-clone",
  storageBucket: "react-slack-chat-app-clone.appspot.com",
  messagingSenderId: "398146130004",
  appId: "1:398146130004:web:bed6642d9567bedf691dc1",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
