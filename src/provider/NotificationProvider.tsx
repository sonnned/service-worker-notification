import { type ReactNode, useEffect } from "preact/compat";
// import { messaging } from "../firebase";
// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "../firebase";
// import { getToken } from "firebase/messaging";
// import { useStore } from "@nanostores/preact";
import { currentStatus } from "../store/currentStatus";

interface Notification {
  children: ReactNode;
}

const NotificationProvider = ({ children }: Notification) => {
  // const $currentStatus = useStore(currentStatus);

  // const requestPermission = async () => {
  //   console.log("Requesting permission...");
  //   if (Notification.permission === "granted") {
  //     console.log("Permission granted.");
  //     return getToken(messaging, {
  //       vapidKey: "BPBuppg0evzZutUL4I6SyROk2byA4IJBEFXcfIaVIvdZnv4rciuL8SC5DZBiknDtWeqz6FqY-aMHmb3KlF0yN2Q"
  //     }).then((currentToken) => {
  //       if (currentToken) {
  //         console.log("Token: ", currentToken);
  //         currentStatus.set({
  //           ...$currentStatus,
  //           notificationToken: currentToken
  //         })
  //       } else {
  //         console.log("No registration token available. Request permission to generate one.");
  //       }
  //     }).catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //     });
  //   }
  // }

  useEffect(() => {
    // requestPermission()

    // const unsubscribe = onMessageListener().then(payload => {
    //   console.log("payload", payload)
    // });

    // return () => {
    //   unsubscribe.catch(() => console.log("err"))
    // }

    navigator.serviceWorker.register('sw.js');
    Notification.requestPermission((result) => {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('Hello, World!');
        });
      }
    })
  }, [])

  useEffect(() => {
    // if (currentStatus.get().notificationToken) {
    //   fetch(`https://fcm.googleapis.com//v1/projects/usatags/messages:send`, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       message: {
    //         // token: currentStatus.get().notificationToken,
    //         topic: "all",
    //         notification: {
    //           title: "Hello",
    //           body: "World"
    //         }
    //       }
    //     }),
    //     headers: {
    //       ContentType: "application/json",
    //       Authorization: `Bearer ${import.meta.env.VITE_FIREBASE_MESSAGING_SERVER_KEY}`
    //     }
    //   }).then(response => {
    //       console.log("response", response)
    //     })
    // }
  }, [currentStatus.get().notificationToken])

  return (
    <body class="bg-gray-100 text-neutral-900 font-sans antialiased">
      {children}
    </body>
  );
};

export default NotificationProvider;
