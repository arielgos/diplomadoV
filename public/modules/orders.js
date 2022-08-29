import { trackEvent, firestore } from "./firebase.js";
import { collection, getDocs, query, orderBy, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const ordersModule = {
    orders: [],
    orderSelected: {},
    init: async () => {
        trackEvent("Orders");
        await view.load("./modules/orders.html", ordersModule.events);
    },
    events: () => {
        ordersModule.load();

        $('#orderModal #save').click(async function (event) {
            event.preventDefault();
            ordersModule.save();
        });

    },
    load: async () => {
        loading.show();
        $("#wrapper #table tbody").html("");
        ordersModule.orders = [];

        const querySnapshot = await getDocs(query(collection(firestore, "orders"), orderBy("date")));
        querySnapshot.forEach(async (snapshot) => {
            let order = snapshot.data();
            order.id = snapshot.id;
            //pending
            let bgStatus = "table-primary";
            //inProcess
            if (order.status == 1) {
                bgStatus = "table-success";
            }
            //delivered
            if (order.status == 2) {
                bgStatus = "table-active";
            }
            let user = await getDoc(doc(firestore, "users", order.userId));
            order.user = user.data();
            let position = $("#wrapper #table tbody tr").length;
            let tr = $("<tr>", {
                id: order.id,
                position: position,
                class: bgStatus,
                click: () => {
                    ordersModule.orderSelected = ordersModule.orders[position];
                    $("#orderModal #id").html(ordersModule.orderSelected.id);
                    $("#orderModal #user").html(ordersModule.orderSelected.user.name);
                    $("#orderModal #date").html(formatter.date(ordersModule.orderSelected.date.toDate()));
                    $("#orderModal #total").html(formatter.money(ordersModule.orderSelected.total, 2));
                    $("#orderModal table tbody").html("");
                    ordersModule.orderSelected.details.forEach((item, index) => {
                        let row = "";
                        row += "<td>" + (index + 1) + "</td>";
                        row += "<td>" + item.productName + "</td>";
                        row += "<td class=\"text-end\">" + item.quantity + "</td>";
                        row += "<td class=\"text-end\">" + formatter.money(item.price, 2) + "</td>";
                        row += "<td class=\"text-end\"><b>" + formatter.money(item.total, 2) + "</b></td>";
                        $("#orderModal table tbody").append("<tr>" + row + "</tr>");
                    });

                    if (ordersModule.orderSelected.status == 0) {
                        $("#orderModal #pending").prop("checked", true);
                    }
                    if (ordersModule.orderSelected.status == 1) {
                        $("#orderModal #inProgress").prop("checked", true);
                    }
                    if (ordersModule.orderSelected.status == 2) {
                        $("#orderModal #delivered").prop("checked", true);
                    }

                    $("#orderModal").modal('show');
                }
            });
            let number = $("<td>");
            let id = $("<td>");
            let date = $("<td>");
            let customer = $("<td>");
            let total = $("<td>", { class: "text-end" });
            number.html(position + 1);
            id.html(snapshot.id);
            customer.html(user.data().name);
            date.html(formatter.date(order.date.toDate()));
            total.html(formatter.money(order.total, 2));
            tr.append(number);
            tr.append(id);
            tr.append(date);
            tr.append(customer);
            tr.append(total);
            ordersModule.orders.push(order);
            $("#wrapper #table tbody").append(tr);
        });

        loading.hide();
    },
    save: async () => {
        loading.show();
        if ($("#orderModal #pending").prop("checked")) {
            ordersModule.orderSelected.status = 0;
        }
        if ($("#orderModal #inProgress").prop("checked")) {
            ordersModule.orderSelected.status = 1;
        }
        if ($("#orderModal #delivered").prop("checked")) {
            ordersModule.orderSelected.status = 2;
        }

        const reference = doc(firestore, "orders", ordersModule.orderSelected.id);
        await updateDoc(reference, {
            status: ordersModule.orderSelected.status
        });

        ordersModule.load();

        loading.hide();

        $('#orderModal').modal('hide');

        swal("Confirmación", "Pedido actualizado", "success");

    }
};

export { ordersModule }