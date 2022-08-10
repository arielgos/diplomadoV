import { trackEvent, authentication, firestore } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
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
                $('#loginModal').modal('hide');
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
            .then(async (userCredential) => {
                loading(false);
                const user = userCredential.user;
                console.log(user);
                try {
                    const userRef = await addDoc(collection(firestore, "users"), {
                        "id": userCredential.user.uid,
                        "name": name,
                        "email": email,
                        "profile": 0
                    });
                    console.log("Document written with ID: ", userRef.id);
                    $('#registerModal').modal('hide');
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

    /**
     * Sign Out
     */
    $("#signOut").click(function (event) {
        event.preventDefault();
        signOut(authentication).then(() => {
            loading(true);
            location.reload();
        }).catch((error) => {
            console.error(error.message, error);
        });
    });

});

/**
 * Auth State listener
 */
onAuthStateChanged(authentication, async (user) => {
    if (user) {
        loading(true);
        const querySnapshot = await getDocs(query(collection(firestore, "users"), where("id", "==", user.uid)));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            $('.private').show();
            $('.public').hide();
            loading(false);
        });
    } else {
        $('.private').hide();
        $('.public').show();
    }
});