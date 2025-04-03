import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered successfully with scope:", registration.scope);

        // Request Notification Permission
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
          } else {
            console.warn("Notification permission denied.");
          }
        });

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(registration => {
              return registration.sync.register('syncMessage')
                  .then(() => console.log('Sync event registered'))
                  .catch(err => console.error('Sync registration failed', err));
          });
      }
      

        // Push Notification Setup
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BD13Iv9g2jOfJ-7JtItR7smZV7rk5DgFWfB43GLh7HgjrATPzJKDS8jCGYFNnaTutJM-5oN885EjYB0k1CfOG2s" // Replace with actual VAPID key
          }).then((subscription) => {
            console.log("Push Notification Subscription successful:", subscription);
          }).catch((error) => {
            console.error("Push Notification Subscription failed:", error);
          });
        });

        // Background Sync Setup
        navigator.serviceWorker.ready.then((reg) => {
          if ("sync" in reg) {
            reg.sync.register("syncMessage").then(() => {
              console.log("Background sync registered successfully.");
            }).catch((error) => {
              console.error("Background sync registration failed:", error);
            });
          } else {
            console.warn("SyncManager is not supported.");
          }
        });

      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
