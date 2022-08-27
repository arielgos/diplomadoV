import { trackEvent, storage, firestore } from "./firebase.js";
import { collection, getDocs, query, orderBy, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

const productsModule = {
    products: [],
    productSelected: {},
    fileToUpload: {},
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
            $("#productModal .modal-body input").val("");
            $("#productModal .modal-body textarea").val("");
            $("#productModal .modal-body input[type=checkbox]").prop("checked", "");
            $("#productModal #imageLoaded").attr("src", null);
            productsModule.productSelected = {
                id: ""
            };
        });

        $('#image').change(async (event) => {
            productsModule.fileToUpload = event.target.files[0];
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
            let image = $("<td>");
            let name = $("<td>");
            let detail = $("<td>");
            let price = $("<td>", { class: "text-end" });
            let tags = $("<td>");
            let status = $("<td>");
            number.html(position + 1);
            image.html("<img src=\"https://firebasestorage.googleapis.com/v0/b/diplomadov-f5e39.appspot.com/o/thumb_" + product.image + "?alt=media\" width=\"48px\">");
            name.html(product.name);
            detail.html(product.description);
            price.html(product.price);
            tags.html(product.tags);
            status.html("");
            if (product.status) {
                status.html("<span class=\"fa fa-check\"></span>");
            }

            tr.append(number);
            tr.append(image);
            tr.append(name);
            tr.append(detail);
            tr.append(price);
            tr.append(tags);
            tr.append(status);

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
            const imageLoaded = "https://firebasestorage.googleapis.com/v0/b/diplomadov-f5e39.appspot.com/o/" + productsModule.productSelected.image + "?alt=media";
            $("#productModal #name").val(productsModule.productSelected.name);
            $("#productModal #price").val(productsModule.productSelected.price);
            $("#productModal #tags").val(productsModule.productSelected.tags);
            $("#productModal #status").prop("checked", productsModule.productSelected.status);
            $("#productModal #description").val(productsModule.productSelected.description);
            $("#productModal #imageLoaded").attr("src", imageLoaded);
            $("#productModal").modal('show');
        });
    },
    save: async () => {
        let name = $('#productModal #name').val();
        let price = $('#productModal #price').val();
        let tags = $('#productModal #tags').val();
        let status = $('#productModal #status').prop("checked");
        let description = $('#productModal #description').val();

        if (name == "") {
            swal("Advertencia!", "El nombre no puede estar vacio", "warning");
            return;
        }
        if (price == "") {
            swal("Advertencia!", "El precio no puede estar vacio", "warning");
            return;
        }
        if (tags == "") {
            swal("Advertencia!", "Los tags no pueden estar vacio", "warning");
            return;
        }

        productsModule.productSelected.name = name;
        productsModule.productSelected.price = price;
        productsModule.productSelected.tags = tags;
        productsModule.productSelected.status = status;
        productsModule.productSelected.description = description;

        loading.show();

        if (productsModule.productSelected.id != "") {
            if (productsModule.fileToUpload.name != undefined && productsModule.fileToUpload.name != "") {
                let reference = ref(storage, productsModule.fileToUpload.name);
                await uploadBytes(reference, productsModule.fileToUpload)
                    .then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        productsModule.productSelected.image = productsModule.fileToUpload.name;
                    });
            }
            await setDoc(doc(firestore, "products", productsModule.productSelected.id), productsModule.productSelected);
            $('#productModal').modal('hide');
            swal("Confirmación", "El producto ha sido actualizado con exito", "success");
        } else {

            if (productsModule.fileToUpload.name != undefined && productsModule.fileToUpload.name != "") {
                let reference = ref(storage, productsModule.fileToUpload.name);
                await uploadBytes(reference, productsModule.fileToUpload)
                    .then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        productsModule.productSelected.image = productsModule.fileToUpload.name;
                    });
            }

            const newReference = await doc(collection(firestore, "products"));
            productsModule.productSelected.id = newReference.id;
            await setDoc(newReference, productsModule.productSelected);

            $('#productModal').modal('hide');
            swal("Confirmación", "El producto ha sido registrado con exito", "success");
        }
        productsModule.load();
        loading.hide();


        /**
         let reference = ref(storage, firstFile.name);
         loading.show();
         await uploadBytes(reference, firstFile)
             .then((snapshot) => {
                 console.log(snapshot);
                 console.log('Uploaded a blob or file!');
                 loading.hide();
             });
        */

    }
};

export { productsModule }