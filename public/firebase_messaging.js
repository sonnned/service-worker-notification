importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBbzXjoOqScK78N6bHW19HGJNOos7bJU54",
  authDomain: "usatags.firebaseapp.com",
  projectId: "usatags",
  storageBucket: "usatags.appspot.com",
  messagingSenderId: "202627260130",
  appId: "1:202627260130:web:f63d5a9e0a1495313388bb",
  measurementId: "G-KJPZLQZPMD"
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.notification.icon,
    // image: payload.notification.image,
    // data: payload.notification.click_action
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});