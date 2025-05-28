import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parcial2.app',
  appName: 'parcial-2',
  webDir: 'www',
  plugins: {
    VoiceRecorder: {
      microphonePermission: 'Necesitamos acceso al micrófono para grabar mensajes de voz.'
    },
    FilePicker: {
      android: {
        // Configuración específica de Android
        useLegacyPicker: false, // Usar el nuevo selector de archivos (Android 11+)
        
        // Opciones para cache
        cacheDirectory: 'CACHE_DIRECTORY',
        
        // Tiempo de vida del cache (en segundos)
        cacheMaxAge: 3600
      },
      
      // Configuración general
      multipleSelection: false, // Permitir selección múltiple por defecto
      readData: true, // Leer los datos del archivo por defecto
      
      // Tipos de archivo permitidos por defecto
      defaultTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    }
  }
};

export default config;
