import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-remote-config.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging.js";
import { loading } from "./utils.js";

const config = {
    apiKey: "AIzaSyCN434D3q_QIE1yDFf4QNtiKRDp93mA3fs",
    authDomain: "diplomadov-f5e39.firebaseapp.com",
    projectId: "diplomadov-f5e39",
    storageBucket: "diplomadov-f5e39.appspot.com",
    messagingSenderId: "135023020170",
    appId: "1:135023020170:web:3d9646ba3b832a1d878573",
    measurementId: "G-MWL22S5EDC",
    databaseURL: "https://diplomadov-f5e39-default-rtdb.firebaseio.com"
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

/**
 * Analytics
 */
setUserProperties(analytics, { platform: 'web' });
logEvent(analytics, 'Firebase Loaded');

function trackEvent(message) {
    console.log(message);
    logEvent(analytics, message);
}

trackEvent('App Loaded...');

/**
 * Remote config
 */
remoteConfig.settings.minimumFetchIntervalMillis = 3600;

const rcDefaultsFile = await fetch('remote_config_defaults.json');
const rcDefaultsJson = await rcDefaultsFile.json();

remoteConfig.defaultConfig = rcDefaultsJson;

let appTitle = remoteConfig.defaultConfig.appTitle;
let version = remoteConfig.defaultConfig.version;

updateTitle(appTitle, version);

fetchAndActivate(remoteConfig)
    .then(() => {
        let appTitle = getValue(remoteConfig, "appTitle").asString();
        let version = getValue(remoteConfig, "version").asNumber();
        updateTitle(appTitle, version);
    })
    .catch((err) => {
        console.error(err);
    });

function updateTitle(title, version) {
    document.title = title + " [" + version + "]";
}

/**
 * Auth State listener
 */
onAuthStateChanged(authentication, async (user) => {
    if (user) {
        loading(true);
        const querySnapshot = await getDocs(query(collection(firestore, "users"), where("id", "==", user.uid)));
        querySnapshot.forEach((doc) => {
            loading(false);
            if (!location.href.toLowerCase().includes("console.html")) {
                location.href = "console.html";
            }
        });
    } else if (!location.href.toLowerCase().includes("index.html")) {
        location.href = "index.html";
    }
});

export { firebase, trackEvent, remoteConfig, authentication, realtimeDatabase, firestore, messaging, appTitle, version }