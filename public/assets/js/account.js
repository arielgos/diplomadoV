import { trackEvent, authentication } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { loading } from "./utils.js";

$(function () {
    trackEvent('App Loaded...');
    /**
     * Login
     */
    $('#loginModal .btn-primary').click(function (event) {
        event.preventDefault();
        let email = $('#loginModal #email').val();
        let password = $('#loginModal #password').val();

        loading(true);

        signInWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                loading(false);
            })
            .catch((error) => {
                loading(false);
                console.error(error.message, error)
                swal("Advertencia!", "Usuario o contraseña incorrectos no encontrado", "warning");
            });
    });

    /**
     * Register
     */

    $('#registerModal .btn-primary').click(function (event) {
        event.preventDefault();
        let name = $('#loginModal #name').val();
        let email = $('#loginModal #email').val();
        let password = $('#loginModal #password').val();

        loading(true);

        createUserWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                loading(false);
                console.error(error.message, error);
                swal("Error!", "No se ha podido crear al usuario", "error");
            });
    });

});