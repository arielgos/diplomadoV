import { appTitle, trackEvent, authentication } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

$(() => {
    loginModule.init();
});

const loginModule = {
    init: () => {
        trackEvent("Index");

        $("#loginModule #title").html(appTitle);

        $("#loginModule").submit((event) => {
            event.preventDefault();
            let email = $('#loginModule #email').val();
            let password = $('#loginModule #password').val();
            loginModule.login(email, password);
        });

        loading.hide();
    },
    login: (email, password) => {
        loading.show();
        signInWithEmailAndPassword(authentication, email, password)
            .then(() => {
                location.href = "console.html";
            })
            .catch((error) => {
                loading.hide();
                console.error(error.message, error)
                swal("Advertencia!", "Usuario no encontrado, por favor revise sus credenciales", "warning");
            });
    }
};