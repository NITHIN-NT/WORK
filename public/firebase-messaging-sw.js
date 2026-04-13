importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCYk2NhrnyG0sh1yBFq1kUqyUHd4fTxd44",
  authDomain: "work-a65c9.firebaseapp.com",
  projectId: "work-a65c9",
  storageBucket: "work-a65c9.firebasestorage.app",
  messagingSenderId: "78321413780",
  appId: "1:78321413780:web:e71f2d91576d55781a0e81",
  measurementId: "G-413NBX471F"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
