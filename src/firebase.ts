/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfigJson from '../firebase-applet-config.json';

// Configuración de Firebase con soporte para variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

/**
 * Instancia de Firestore para la base de datos.
 * Se utiliza el firestoreDatabaseId configurado.
 */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Instancia de Auth para la autenticación de usuarios.
 */
export const auth = getAuth(app);

/**
 * Instancia de Storage para el almacenamiento de archivos.
 */
export const storage = getStorage(app);

export default app;
