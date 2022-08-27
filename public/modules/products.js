import { trackEvent, storage, firestore } from "./firebase.js";
import { collection, getDocs, query, orderBy, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

const productsModule = {
    products: [],
    productSelected: {},
    init: async () => {
        trackEvent("Products");
        await view.load("./modules/products.html", productsModule.events);
    },
    events: () => {
        productsModule.load();
        $('#productModal #save').click(async function (event) {
            event.preventDefault();
            productsModule.save();
        });

        $("#wrapper #add").click(function (event) {
            event.preventDefault();
            $("#productModal #name").val("");
            productsModule.productSelected = {
                id: 0
            };
        });

        $('#image').change(async (event) => {
            let firstFile = event.target.files[0];
            let reference = ref(storage, firstFile.name);
            loading.show();
            await uploadBytes(reference, firstFile)
                .then((snapshot) => {
                    console.log(snapshot);
                    console.log('Uploaded a blob or file!');
                    loading.hide();
                });
        });

    },
    load: async () => {
        loading.show();
        $("#wrapper tbody").html("");
        productsModule.products = [];

        const querySnapshot = await getDocs(query(collection(firestore, "products"), orderBy("name")));
        querySnapshot.forEach((doc) => {
            let product = doc.data();
            let position = $("#wrapper tbody tr").length;
            let tr = $("<tr>");
            let number = $("<td>");
            let name = $("<td>");
            number.html(position + 1);
            name.html(product.name);

            tr.append(number);
            tr.append(name);

            tr.attr({
                position: position,
                id: product.id
            });

            productsModule.products.push(product);
            $("#wrapper tbody").append(tr);

        });

        loading.hide();

        $("#wrapper tbody tr").click((row) => {
            productsModule.productSelected = productsModule.products[$(row.currentTarget).attr("position")];
            $("#productModal #name").val(productsModule.productSelected.name);
            $("#productModal").modal('show');
        });
    },
    save: async () => {

    }
};

export { productsModule }