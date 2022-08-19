import { trackEvent, authentication, appTitle } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { loading } from "./utils.js";

$(function () {
    //event
    trackEvent("Login");

    loading(false);
    
    $("#login #title").html(appTitle);

    //rewrite submit
    $('#login').submit(function (event) {
        event.preventDefault();
        $('#login .btn-primary').click();
    });

    //button event
    $('#login .btn-primary').click(function (event) {
        event.preventDefault();
        let email = $('#login #email').val();
        let password = $('#login #password').val();

        loading(true);

        signInWithEmailAndPassword(authentication, email, password)
            .then(() => {
                trackEvent('Login...');
            })
            .catch((error) => {
                loading(false);
                console.error(error.message, error)
                swal("Advertencia!", "Usuario no encontrado, por favor revise sus credenciales", "warning");
            });
    });
});
