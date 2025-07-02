// firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIwDPoVCms0UX8X0iEK-8N37PdwZFEIM0",
  authDomain: "social-media-44339.firebaseapp.com",
  projectId: "social-media-44339",
  storageBucket: "social-media-44339.appspot.com",
  messagingSenderId: "1087561634857",
  appId: "1:1087561634857:web:d2170b600c942dd118b838",
  measurementId: "G-CWTDV7C79L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app); 
