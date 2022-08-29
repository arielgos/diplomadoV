import { trackEvent, realtimeDatabase } from "./firebase.js";

const chatModule = {
    init: async () => {
        trackEvent("Chat");
        await view.load("./modules/chat.html", chatModule.events);
    },
    events: () => { 

    }
};
export { chatModule }