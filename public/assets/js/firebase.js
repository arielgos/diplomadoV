import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-remote-config.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

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


/**
 * Analytics
 */
setUserProperties(analytics, { platform: 'web' });
logEvent(analytics, 'Firebase Loaded');

/**
 * Remote config
 */
remoteConfig.settings.minimumFetchIntervalMillis = 3600;

const rcDefaultsFile = await fetch('remote_config_defaults.json');
const rcDefaultsJson = await rcDefaultsFile.json();

remoteConfig.defaultConfig = rcDefaultsJson;

updateTitle(remoteConfig.defaultConfig.appTitle, remoteConfig.defaultConfig.version);

fetchAndActivate(remoteConfig)
    .then(() => {
        const appTitle = getValue(remoteConfig, "appTitle");
        const version = getValue(remoteConfig, "version");
        updateTitle(appTitle.asString(), version.asNumber());
    })
    .catch((err) => {
        console.error(err);
    });

function updateTitle(title, version) {
    document.title = title + " [" + version + "]";
    document.getElementById('title').innerHTML = document.title;
}


function trackEvent(message) {
    console.log(message);
    logEvent(analytics, message);
}

export { firebase, trackEvent, remoteConfig, authentication, realtimeDatabase, firestore }