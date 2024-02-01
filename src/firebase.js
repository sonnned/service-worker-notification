import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBbzXjoOqScK78N6bHW19HGJNOos7bJU54",
  authDomain: "usatags.firebaseapp.com",
  projectId: "usatags",
  storageBucket: "usatags.appspot.com",
  messagingSenderId: "202627260130",
  appId: "1:202627260130:web:f63d5a9e0a1495313388bb",
  measurementId: "G-KJPZLQZPMD"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// export const requestPermission = async () => {
//   console.log("Requesting permission...");
//   if (Notification.permission === "granted") {
//     console.log("Permission granted.");
//     return getToken(messaging, {
//       vapidKey: "BPBuppg0evzZutUL4I6SyROk2byA4IJBEFXcfIaVIvdZnv4rciuL8SC5DZBiknDtWeqz6FqY-aMHmb3KlF0yN2Q"
//     }).then((currentToken) => {
//       if (currentToken) {
//         console.log("Token: ", currentToken);
//       } else {
//         console.log("No registration token available. Request permission to generate one.");
//       }
//     }).catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
//   }
// }


// requestPermission();

export const onMessageListener = () => {
  return new Promise(resolve => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  })
}