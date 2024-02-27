// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDH4m-LrS0QfE6dkdcHsdIiR70bcGSVtS0',
	authDomain: 'dashboard-371211.firebaseapp.com',
	projectId: 'dashboard-371211',
	storageBucket: 'dashboard-371211.appspot.com',
	messagingSenderId: '886839902541',
	appId: '1:886839902541:web:eca8cc90ea018367a5b704',
	measurementId: 'G-JR3Z525VJQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app);
