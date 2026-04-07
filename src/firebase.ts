/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

/**
 * Instancia de Firestore para la base de datos.
 * Se utiliza el firestoreDatabaseId configurado en el archivo JSON.
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
