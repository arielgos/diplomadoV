import { trackEvent } from "./firebase.js";

const dashboardModule = {
    init: async () => {
        trackEvent("Dashboard");
        await view.load("./modules/dashboard.html", dashboardModule.events);
    },
    events: () => {
        $("#content").click(() => {
            console.log("click");
        });
    }
};

export { dashboardModule }