import { trackEvent, appTitle, currentUser, authentication } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { loading } from "./utils.js";

$(function () {
    //event
    trackEvent("Dashboard");

    loading(false);

    $(".navbar #title").html(appTitle);

    /**
     * My account
     */
    $('#accountModal .btn-primary').click(async function (event) {
        event.preventDefault();
        loading(true);
        let user = currentUser();
        user.name = $('#accountModal #name').val();
        await setDoc(doc(firestore, "users", id), user);
        loading(false);
        $('#accountModal').modal('hide');
        swal("Confirmación", "Su cuenta ha sido actualizada", "success");
    });

    $('#accountModal').on('shown.bs.modal', () => {
        let user = currentUser();
        $('#accountModal #name').val(user.name);
        $('#accountModal #email').val(user.email);
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
