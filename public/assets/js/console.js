import { trackEvent, appTitle } from "./firebase.js";
import { loading } from "./utils.js";

$(function () {
    //event
    trackEvent("Dashboard");

    loading(false);

    $(".navbar #title").html(appTitle);
});
