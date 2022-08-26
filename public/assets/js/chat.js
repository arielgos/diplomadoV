import { trackEvent } from "./firebase.js";

$(function () {

    $("#chatMenu").click(async function (event) {
        event.preventDefault();
        $(".container").hide();
        $("#chatModule").show();

        trackEvent("Chats");

    });
});