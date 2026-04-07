/**
 * Configuración para la integración con Google Drive.
 * Se utilizan variables de entorno para mayor seguridad en el despliegue.
 */
export const DRIVE_CONFIG = {
  API_KEY: import.meta.env.VITE_DRIVE_API_KEY || 'AIzaSyB6G8cz3IHuJ9sfcIeKLd21u7kEHkQyyWI',
  FOLDER_ID: import.meta.env.VITE_DRIVE_FOLDER_ID || '149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG_vH35Yf1rWbc_ge0twuYgN1ILprr7Mq0',
};
