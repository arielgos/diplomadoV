import { trackEvent } from "./firebase.js";

const dashboardModule = {
    init: async () => {
        trackEvent("Dashboard");
        loading.show();
        await view.load("./dashboard.html", () => {
            loading.hide();
            dashboardModule.events();
        });
    },
    events: () => {
        $("#content").click(() => {
            console.log("click");
        });
    }
};

export { dashboardModule }