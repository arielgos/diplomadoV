import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCN434D3q_QIE1yDFf4QNtiKRDp93mA3fs",
    authDomain: "diplomadov-f5e39.firebaseapp.com",
    projectId: "diplomadov-f5e39",
    storageBucket: "diplomadov-f5e39.appspot.com",
    messagingSenderId: "135023020170",
    appId: "1:135023020170:web:3d9646ba3b832a1d878573",
    measurementId: "G-MWL22S5EDC"
};

const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);

//analytics
logEvent(analytics, 'App Start');

let trackEventButton = document.getElementById("trackEvent");

trackEventButton.addEventListener('click', function (event) {
    event.preventDefault();
    logEvent(analytics, 'Track Event Click');
    console.log("Evento rastreado");
});



