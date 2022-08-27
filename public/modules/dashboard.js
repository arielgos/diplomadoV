import { trackEvent } from "./firebase.js";

const dashboardModule = {
    init: async () => {
        trackEvent("Dashboard");
        loading.show();
        await view.load("./dashboard.html", () => {
            console.log("loaded");
            loading.hide();
        });
    },
    events: () => {

    }
};

export { dashboardModule }