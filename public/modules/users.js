import { trackEvent, firestore } from "./firebase.js";
import { collection, getDocs, query, orderBy, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const usersModule = {
    users: [],
    userSelected: {},
    init: async () => {
        trackEvent("Users");
        await view.load("./modules/users.html", usersModule.events);
    },
    events: async () => {
        usersModule.load();
        $('#userModal #save').click(async function (event) {
            event.preventDefault();
            usersModule.save();
        });
    },
    load: async () => {
        loading.show();
        $("#wrapper tbody").html("");
        usersModule.users = [];

        const querySnapshot = await getDocs(query(collection(firestore, "users"), orderBy("name")));
        querySnapshot.forEach((doc) => {
            let user = doc.data();
            let position = $("#wrapper tbody tr").length;
            let tr = $("<tr>");
            let number = $("<td>");
            let name = $("<td>");
            let email = $("<td>");
            let profile = $("<td>", {
                class: "text-center"
            });
            let token = $("<td>", {
                class: "text-center"
            });
            number.html(position + 1);
            name.html(user.name);
            email.html(user.email);
            profile.html("<span class='fa fa-user'></span>");
            if (user.profile == 1) {
                profile.html("<span class='fa fa-user-gear'></span>");
                tr.attr({
                    class: "table-warning"
                });
            }
            if (user.token != "") {
                token.html("<span class='fa fa-check'></span>");
            }

            tr.append(number);
            tr.append(name);
            tr.append(email);
            tr.append(profile);
            tr.append(token);

            tr.attr({
                position: position,
                id: user.id
            });

            usersModule.users.push(user);
            $("#wrapper tbody").append(tr);

        });

        loading.hide();

        $("#wrapper tbody tr").click((row) => {
            usersModule.userSelected = usersModule.users[$(row.currentTarget).attr("position")];
            $("#userModal #name").val(usersModule.userSelected.name);
            $("#userModal #email").val(usersModule.userSelected.email);
            $("#userModal #profile").prop("checked", false);
            if (usersModule.userSelected.profile == 1) {
                $("#userModal #profile").prop("checked", true);
            }
            $("#userModal #token").val(usersModule.userSelected.token);
            $("#userModal").modal('show');
        });
    },
    save: async () => {
        let name = $('#userModal #name').val();
        let email = $('#userModal #email').val();
        let password = $('#userModal #password').val();
        let profile = $('#userModal #profile').prop("checked");

        if (password == "") {
            swal("Advertencia!", "El código de acceso no puede estar vacio", "warning");
            return;
        }
        if (password.length < 6) {
            swal("Advertencia!", "El código de acceso no puede tener menos de 6 caracteres", "warning");
            return;
        }
        if (name == "") {
            swal("Advertencia!", "El nombre no puede estar vacio", "warning");
            return;
        }
        if (email == "") {
            swal("Advertencia!", "El correo no puede estar vacio", "warning");
            return;
        }

        usersModule.userSelected.name = name;
        usersModule.userSelected.email = email;
        usersModule.userSelected.password = password;
        usersModule.userSelected.profile = profile;

        loading.show();
        await setDoc(doc(firestore, "users", usersModule.userSelected.id), usersModule.userSelected);
        $('#userModal').modal('hide');
        loading.hide();
        swal("Confirmación", "El usuario ha sido actualizado con exito", "success");
        usersModule.load();
    }
};

export { usersModule }