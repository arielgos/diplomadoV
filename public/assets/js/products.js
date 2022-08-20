import { trackEvent, firestore, storage } from "./firebase.js";
import { collection, getDocs, setDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
import { loading } from "./utils.js";

let products = [];
let productSelected = {};

$(function () {

    $("#productMenu").click(async function (event) {
        event.preventDefault();
        $(".container").hide();
        $("#productModule").show();

        trackEvent("Users");

        $("#productModule tbody").html("");
        products = [];
        const querySnapshot = await getDocs(query(collection(firestore, "products"), orderBy("name")));
        querySnapshot.forEach((doc) => {
            let product = doc.data();

        });
    });

    $('#productModal #save').click(async function (event) {
        event.preventDefault();
        const ref = storage.ref();
        const file = $('#image').get(0).files[0];
        const name = (+new Date()) + '-' + file.name;
        const metadata = { contentType: file.type };
        const task = ref.child(name).put(file, metadata);
        task.then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => console.log(url))
    });

});