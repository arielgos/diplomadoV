import { trackEvent, authentication, firebase, firestore } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
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
                loading(false);
                const user = userCredential.user;
                console.log(user);
                trackEvent('Login...');
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
        let name = $('#registerModal #name').val();
        let email = $('#registerModal #email').val();
        let password = $('#registerModal #password').val();
        let confirmPassword = $('#registerModal #confirmPassword').val();

        if (password != confirmPassword) {
            swal("Advertencia!", "El código de acceso y la confirmación no son iguales", "warning");
            return;
        }

        loading(true);

        createUserWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                loading(false);
                const user = userCredential.user;
                console.log(user);
                try {
                    const userRef = addDoc(collection(firestore, "users"), {
                        "id": userCredential.user.uid,
                        "fullName": name,
                        "email": email
                    });
                    console.log("Document written with ID: ", userRef.id);
                    swal("Confirmación", "El usuario ha sido registrado con exito", "success");
                    trackEvent('Registro...');
                } catch (e) {
                    console.error("Error adding document: ", e);
                    swal("Error!", "No se ha podido crear al usuario", "error");
                }
            })
            .catch((error) => {
                loading(false);
                console.error(error.message, error);
                swal("Error!", "No se ha podido crear al usuario", "error");
            });
    });

});