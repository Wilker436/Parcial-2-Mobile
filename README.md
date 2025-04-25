📞 JitCall - Parcial 2

Proyecto desarrollado para el Parcial 2 de la asignatura, con el propósito de implementar una funcionalidad de llamadas simuladas utilizando Firebase, Angular y Capacitor en una app híbrida.

🎥 Video de referencia

Demostración rápida del proyecto: https://youtube.com/shorts/QZS7DLaMZiY?feature=share

🧩 Tecnologías utilizadas

Ionic + Angular: Framework para desarrollo móvil híbrido.

Capacitor: Compilación nativa de la app.

Firebase Auth & Firestore: Gestión de usuarios y almacenamiento de información.

FCM (Firebase Cloud Messaging): Envío de notificaciones simulando llamadas.

UUID: Generación de IDs únicos para reuniones/llamadas.

🚀 Características principales

📲 Login con email/password o Google

👤 Perfil de usuario guardado en Firestore.

📡 Envío de notificaciones tipo "llamada entrante" a otros dispositivos registrados.

🔐 Autenticación JWT con almacenamiento de token.

💬 Mensajes de consola para depuración y seguimiento.

🛠️ Instrucciones para correr el proyecto

1. Clona el repositorio

https://github.com/tu-usuario/jitcall.git

2. Instala dependencias

npm install

3. Configura Firebase

Crea un proyecto en Firebase.

Activa Firestore y Authentication (Email/Password y Google).

Coloca tu firebaseConfig en environments/environment.ts

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDiRoBUdGD3BLPcAEiE20FHqakveBfoYWw",
    authDomain: "parcial-2-df4bf.firebaseapp.com",
    projectId: "parcial-2-df4bf",
    storageBucket: "parcial-2-df4bf.firebasestorage.app",
    messagingSenderId: "192921260273",
    appId: "1:192921260273:web:ab0d536f78327ab6a29950",
  },
  credentials:{
    email: "wilker.pachecoperez@unicolombo.edu.co",
    password: "wilker123W",
  }

};
4. Corre el proyecto en el navegador

ionic serve

5. Correlo en Android

ionic cap run android --livereload --external

⚠️ Asegúrate de tener Android Studio y un dispositivo/emulador configurado.

🧪 Pruebas

Puedes abrir dos instancias de la app (una en navegador y otra en Android) con diferentes usuarios para realizar una llamada.

Revisa la consola para ver los tokens, payloads y respuestas del servidor.

📚 Créditos y recursos

Firebase Documentation

Ionic Framework

CapacitorJS

UUID

🎓 Autor

Proyecto realizado por Wilker Pacheco para el Parcial 2, como ejercicio práctico de integración entre frontend y servicio en la nube para notificaciones push.
