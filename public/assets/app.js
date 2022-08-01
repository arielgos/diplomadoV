import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics, logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-remote-config.js";

const config = {
    apiKey: "AIzaSyCN434D3q_QIE1yDFf4QNtiKRDp93mA3fs",
    authDomain: "diplomadov-f5e39.firebaseapp.com",
    projectId: "diplomadov-f5e39",
    storageBucket: "diplomadov-f5e39.appspot.com",
    messagingSenderId: "135023020170",
    appId: "1:135023020170:web:3d9646ba3b832a1d878573",
    measurementId: "G-MWL22S5EDC"
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

const app = initializeApp(config);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);

//analytics
logEvent(analytics, 'App Start');

setUserProperties(analytics, { platform: 'web' });

let trackSimpleEventButton = document.getElementById("trackSimpleEvent");

trackSimpleEventButton.addEventListener('click', function (event) {
    event.preventDefault();
    logEvent(analytics, 'Track Simple Event Click');
    console.log("Evento rastreado");
});

let trackEventButton = document.getElementById("trackEvent");

trackEventButton.addEventListener('click', function (event) {
    event.preventDefault();

    const params = {
        item_list_id: 'P001',
        item_list_name: 'Products',
        items: [{
            item_id: 'SKU_123',
            item_name: 'Laptop 1',
            item_category: 'PC',
            item_variant: 'black',
            item_brand: 'Apple',
            price: 2350
        }]
    };

    logEvent(analytics, 'Track Event Click', params);

    console.log("Evento con parametros rastreado");
});


/**
 * Remote config
 */
remoteConfig.settings.minimumFetchIntervalMillis = 3600;

const rcDefaultsFile = await fetch('remote_config_defaults.json');
const rcDefaultsJson = await rcDefaultsFile.json();

remoteConfig.defaultConfig = rcDefaultsJson;

console.log(remoteConfig.defaultConfig.welcomeMessage);

fetchAndActivate(remoteConfig)
    .then(() => {
        const welcomeMessage = getValue(remoteConfig, "welcomeMessage");
        console.log(welcomeMessage.asString());
    })
    .catch((err) => {
        console.error(err);
    });