import { trackEvent, realtimeDatabase, firestore, user } from "./firebase.js";
import { ref, onChildAdded, onChildChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const chatModule = {
    chatSelected: {},
    init: async () => {
        trackEvent("Chat");
        await view.load("./modules/chat.html", chatModule.events);
    },
    events: () => {
        chatModule.loadUsers();
    },
    loadUsers: async () => {
        $("#wrapper #users").html("");
        const chatReference = ref(realtimeDatabase, 'chats');

        onChildAdded(chatReference, async (data) => {
            let chatUser = await getDoc(doc(firestore, "users", data.key));
            "<a href=\"#\" class=\"\">" + + "</a>"
            let link = $("<a>", {
                id: data.key,
                class: "list-group-item list-group-item-action",
                click: event => {
                    event.preventDefault();
                    console.log("selected " + data.key);
                    chatModule.chatSelected = data;

                    chatModule.loadChilds(data);

                }
            });
            link.html(chatUser.data().name);
            $("#wrapper #users").append(link);
        });

        onChildChanged(chatReference, (data) => {
            if (data.key == chatModule.chatSelected.key) {
                chatModule.loadChilds(data);
            }
        });
    },
    loadChilds: (data) => {
        $("#wrapper #chat").html("");
        data.forEach((child) => {
            let side = "text-end";
            if (user.id != child.val().uid) {
                side = "text-start";
            }
            let message = $("<p>", {
                id: child.key,
                class: side
            });
            message.html(child.val().message);
            $("#wrapper #chat").prepend(message);
        });
    }
};
export { chatModule }