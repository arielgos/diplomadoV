import { appTitle, authentication } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { dashboardModule } from "./dashboard.js";

$(function () {
    adminModule.init();
    dashboardModule.init();
});

const adminModule = {
    init: () => {
        $(".navbar #title").html(appTitle);
        adminModule.events();
    },
    events: () => {
        $("#signOut").click((event) => {
            event.preventDefault();
            adminModule.signOut();
        });
    },
    signOut: () => {
        signOut(authentication)
            .then(() => {
                loading.show();
                location.href = "index.html";
            }).catch((error) => {
                console.error(error.message, error);
            });
    }
};
