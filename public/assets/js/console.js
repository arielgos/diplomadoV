import { trackEvent} from "./firebase.js";
import { loading } from "./utils.js";

$(function () {
    //event
    trackEvent("Dashboard");

    //loading view
    $("#content").load("dashboard.html", null, function () {
        loading(false);
    });
});
