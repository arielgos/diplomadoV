import { trackEvent, firestore, authentication } from "./firebase.js";
import { collection, getDocs, setDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { loading } from "./utils.js";


let users = [];
let userSelected = {};

$(function () {

    $("#userMenu").click(async function (event) {
        event.preventDefault();
        $(".container").hide();
        $("#userModule").show();

        trackEvent("Users");

        $("#userModule tbody").html("");
        users = [];

        const querySnapshot = await getDocs(query(collection(firestore, "users"), orderBy("name")));
        querySnapshot.forEach((doc) => {
            let user = doc.data();
            let position = $("#userModule tbody tr").length;
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
                    class: "table-primary"
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

            tr.click(function () {
                userSelected = users[$(this).attr("position")];
                $("#userModal #name").val(userSelected.name);
                $("#userModal #email").val(userSelected.email);
                $("#userModal #profile").prop("checked", false);
                if (userSelected.profile == 1) {
                    $("#userModal #profile").prop("checked", true);
                }
                $("#userModal #token").val(userSelected.token);
                $("#userModal").modal('show');
            });

            users.push(user);

            $("#userModule tbody").append(tr);

        });

    });

    //Clean modal fields
    $("#userModule #add").click(function (event) {
        event.preventDefault();
        $("#userModal #name").val("");
        $("#userModal #email").val("");
        $("#userModal #profile").prop("checked", false);
        $("#userModal #token").val("");
        userSelected = {
            id: 0
        };
    });

    $('#userModal #save').click(async function (event) {
        event.preventDefault();
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

        userSelected.name = name;
        userSelected.email = email;
        userSelected.password = password;
        userSelected.profile = profile;

        if (userSelected.id == 0) {
            userSelected.token = "";
            loading(true);
            createUserWithEmailAndPassword(authentication, userSelected.email, userSelected.password)
                .then(async (userCredential) => {
                    try {
                        userSelected.id = userCredential.user.uid;
                        await setDoc(doc(firestore, "users", userSelected.id), userSelected);
                        $('#userModal').modal('hide');
                        loading(false);
                        swal("Confirmación", "El usuario ha sido registrado con exito", "success");
                        trackEvent('Registro...');
                    } catch (e) {
                        loading(false);
                        console.error("Error adding document: ", e);
                        swal("Error!", "No se ha podido crear al usuario", "error");
                    }
                })
                .catch((error) => {
                    loading(false);
                    console.error(error.message, error);
                    swal("Error!", "No se ha podido crear al usuario", "error");
                });
        } else {
            loading(true);
            await setDoc(doc(firestore, "users", userSelected.id), userSelected);
            $('#userModal').modal('hide');
            loading(false);
            swal("Confirmación", "El usuario ha sido actualizado con exito", "success");
            trackEvent('Registro...');
        }
    });

});