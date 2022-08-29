import { trackEvent, firestore } from "./firebase.js";
import { collection, getDocs, query, orderBy, writeBatch, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const pricesModule = {
    products: [],
    init: async () => {
        trackEvent("Prices");
        await view.load("./modules/prices.html", pricesModule.events);
    },
    events: () => {
        pricesModule.load();
        $('#pricesForm').submit(async function (event) {
            event.preventDefault();
            pricesModule.save();
        });
    },
    load: async () => {
        loading.show();
        $("#wrapper tbody").html("");
        pricesModule.products = [];

        const querySnapshot = await getDocs(query(collection(firestore, "products"), orderBy("name")));
        querySnapshot.forEach((doc) => {
            let product = doc.data();
            let position = $("#wrapper tbody tr").length;
            let tr = $("<tr>");
            let number = $("<td>");
            let image = $("<td>");
            let name = $("<td>");
            let price = $("<td>", { class: "text-end" });
            let inputPrice = $("<input>", {
                id: product.id,
                class: "form-control",
                style: "width:130px !important;",
                type: "number",
                value: product.price
            });
            let status = $("<td>", { class: "text-center" });
            number.html(position + 1);
            image.html("<img src=\"https://firebasestorage.googleapis.com/v0/b/diplomadov-f5e39.appspot.com/o/thumb_" + product.image + "?alt=media\" width=\"48px\">");
            name.html(product.name + "<br><i>" + product.tags + "</i>");
            price.html(inputPrice);
            status.html("");
            if (product.status) {
                status.html("<span class=\"fa fa-check\"></span>");
            }

            tr.append(number);
            tr.append(image);
            tr.append(name);
            tr.append(status);
            tr.append(price);

            tr.attr({
                position: position,
                id: product.id
            });

            pricesModule.products.push(product);
            $("#wrapper tbody").append(tr);

        });

        loading.hide();

    },
    save: async () => {
        loading.show();
        const batch = writeBatch(firestore);
        $("#wrapper tbody tr input").each((_, value) => {
            const reference = doc(firestore, "products", $(value).attr("id"));
            batch.update(reference, { price: $(value).val() });
        });
        await batch.commit();
        loading.hide();
        pricesModule.load();
        swal("Confirmación", "Lista de precios actualizada", "success");
    }
};

export { pricesModule }