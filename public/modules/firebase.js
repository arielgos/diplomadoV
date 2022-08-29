import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-remote-config.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

const config = {
    apiKey: "AIzaSyCN434D3q_QIE1yDFf4QNtiKRDp93mA3fs",
    authDomain: "diplomadov-f5e39.firebaseapp.com",
    projectId: "diplomadov-f5e39",
    storageBucket: "diplomadov-f5e39.appspot.com",
    messagingSenderId: "135023020170",
    appId: "1:135023020170:web:3d9646ba3b832a1d878573",
    measurementId: "G-MWL22S5EDC",
    databaseURL: "https://diplomadov-f5e39-default-rtdb.firebaseio.com",
    messagingKey: "BCaU2y_Syir5zzdmsccB56J7D0SgJGEkiECRnPory3pcZ9mwowDQ_E-JQoMaIBvSNHijVIvnr9EUtXxB9-9t280"
};

/**
 * Fix for invalid domain ans session atributes
 */
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); }

window.gtag("config", config.measurementId, {
    cookie_domain: window.location.hostname,
    cookie_flags: "SameSite=None;Secure",
});

const firebase = initializeApp(config);
const analytics = getAnalytics(firebase);
const remoteConfig = getRemoteConfig(firebase);
const realtimeDatabase = getDatabase(firebase);
const firestore = getFirestore(firebase);
const authentication = getAuth(firebase);
const messaging = getMessaging(firebase);
const storage = getStorage(firebase);

/**
 * Analytics
 */
setUserProperties(analytics, { platform: 'web' });
logEvent(analytics, 'Firebase Loaded');

function trackEvent(message) {
    console.log(message);
    logEvent(analytics, message);
}

/**
 * Remote config
 */
remoteConfig.settings.minimumFetchIntervalMillis = 3600;

const rcDefaultsFile = await fetch('remote_config_defaults.json');
const rcDefaultsJson = await rcDefaultsFile.json();

remoteConfig.defaultConfig = rcDefaultsJson;

let appTitle = remoteConfig.defaultConfig.appTitle;
let version = remoteConfig.defaultConfig.version;

fetchAndActivate(remoteConfig)
    .then(() => {
        appTitle = getValue(remoteConfig, "appTitle").asString();
        version = getValue(remoteConfig, "version").asNumber();
        document.title = appTitle + " [" + version + "]";
    })
    .catch((err) => {
        console.error(err);
    });
/**
 * Authentication
 */

let user = null;

/**
* Auth State listener
*/
onAuthStateChanged(authentication, async firebaseUser => {
    if (firebaseUser) {
        const querySnapshot = await getDocs(query(collection(firestore, "users"), where("id", "==", firebaseUser.uid)));
        querySnapshot.forEach((doc) => {
            user = {
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                profile: doc.data().profile,
                token: doc.data().token
            };
        });
    } else if (!location.href.toLowerCase().includes("index.html")) {
        location.href = "index.html";
    }
});

/**
 * Messaging
 */
getToken(messaging, { vapidKey: config.messagingKey })
    .then(async (currentToken) => {
        if (currentToken) {
            console.log(currentToken);
            await fetch("https://us-central1-diplomadov-f5e39.cloudfunctions.net/subscribeTokenToTopic", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: currentToken,
                    topic: "amazingstore"
                })
            }).then(response => {
                console.log(response);
            });
        } else {
            console.log("No registration token available. Request permission to generate one.");
        }
    }).catch((error) => {
        console.log("An error occurred while retrieving token.", error);
    });

onMessage(messaging, payload => {
    console.log('Message received. ', payload);
});


export { appTitle, trackEvent, remoteConfig, realtimeDatabase, firestore, authentication, messaging, storage, user }