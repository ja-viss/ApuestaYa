# Portal Técnico - Apuesta Ya

Portal técnico para la gestión de drivers, sistemas y herramientas de lotería.

## Despliegue en Render

Para desplegar esta aplicación en Render como un **Static Site**:

1.  **Conecta tu repositorio** de GitHub/GitLab a Render.
2.  Selecciona el tipo de servicio **Static Site**.
3.  Configura los siguientes campos:
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
4.  Añade las siguientes **Environment Variables** en el panel de Render:
    *   `VITE_DRIVE_API_KEY`: Tu API Key de Google Drive.
    *   `VITE_DRIVE_FOLDER_ID`: El ID de la carpeta de Drive.
    *   `VITE_FIREBASE_API_KEY`: API Key de Firebase.
    *   `VITE_FIREBASE_AUTH_DOMAIN`: Dominio de autenticación de Firebase.
    *   `VITE_FIREBASE_PROJECT_ID`: ID del proyecto de Firebase.
    *   `VITE_FIREBASE_STORAGE_BUCKET`: Bucket de almacenamiento de Firebase.
    *   `VITE_FIREBASE_MESSAGING_SENDER_ID`: ID del remitente de mensajería.
    *   `VITE_FIREBASE_APP_ID`: ID de la aplicación de Firebase.
    *   `VITE_FIREBASE_FIRESTORE_DATABASE_ID`: ID de la base de datos de Firestore.

### Notas importantes:
*   La aplicación utiliza `react-router-dom`, por lo que se ha incluido un archivo `public/_redirects` y una configuración en `render.yaml` para manejar las rutas del lado del cliente (SPA).
*   Si no configuras las variables de entorno, la aplicación intentará usar los valores por defecto configurados en el código (si están presentes).

## Desarrollo Local

1.  Instala las dependencias: `npm install`
2.  Inicia el servidor de desarrollo: `npm run dev`
3.  Construye para producción: `npm run build`
