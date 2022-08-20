import { trackEvent, authentication, firestore } from "./firebase.js";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { loading } from "./utils.js";

$(function () {

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
                try {
                    await setDoc(doc(firestore, "users", userCredential.user.uid), {
                        id: userCredential.user.uid,
                        name: name,
                        email: email,
                        profile: 0,
                        token: ""
                    });

                    $('#registerModal').modal('hide');
                    loading(false);
                    swal("Confirmación", "El usuario ha sido registrado con exito", "success");
                    trackEvent('Registro...');
                } catch (e) {
                    loading(false);
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

    /**
     * My account
     */
    $('#accountModal .btn-primary').click(async function (event) {
        event.preventDefault();
        let id = $('#accountModal #id').val();
        let name = $('#accountModal #name').val();
        let email = $('#accountModal #email').val();
        let profile = $('#accountModal #profile').val();
        let token = $('#accountModal #token').val();
        loading(true);
        await setDoc(doc(firestore, "users", id), {
            id: id,
            name: name,
            email: email,
            profile: profile,
            token: token
        });
        loading(false);
        $('#accountModal').modal('hide');
        swal("Confirmación", "Su cuenta ha sido actualizada", "success");
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
            $('.private').show();
            $('.public').hide();
            loading(false);
            /**
             * Loading user data
             */
            $('#accountModal #id').val(doc.id);
            $('#accountModal #name').val(doc.data().name);
            $('#accountModal #email').val(doc.data().email);
            $('#accountModal #profile').val(doc.data().profile);
            $('#accountModal #token').val(doc.data().token);
        });
    } else {
        $('.private').hide();
        $('.public').show();
    }
});