import { appTitle, authentication } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { dashboardModule } from "./dashboard.js";
import { usersModule } from "./users.js";
import { productsModule } from "./products.js";
import { pricesModule } from "./prices.js";
import { ordersModule } from "./orders.js";
import { chatModule } from "./chat.js";

$(function () {
    adminModule.init();
    dashboardModule.init();
    //chatModule.init();
});

const adminModule = {
    init: () => {
        $(".navbar #title").html(appTitle);
        adminModule.events();
    },
    events: () => {

        $("#dashboardModule").click((event) => {
            event.preventDefault();
            dashboardModule.init();
        });

        $("#ordersModule").click((event) => {
            event.preventDefault();
            ordersModule.init();
        });

        $("#pricesModule").click((event) => {
            event.preventDefault();
            pricesModule.init();
        });

        $("#productsModule").click((event) => {
            event.preventDefault();
            productsModule.init();
        });

        $("#usersModule").click((event) => {
            event.preventDefault();
            usersModule.init();
        });

        $("#chatModule").click((event) => {
            event.preventDefault();
            chatModule.init();
        });

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
