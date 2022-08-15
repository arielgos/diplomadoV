const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});


exports.newImage = functions.storage.object().onFinalize(() => {

    const payload = {
        notification: {
            title: "Amazing Store",
            body: "Una nueva imagen ha sido agregada a la tienda"
        }
    };

    return admin.messaging().sendToTopic("amazingstore", payload)
        .then((response) => {
            console.log("Successfully sent message:", response);
        }).catch((error) => {
            console.log("Notification sent failed:", error);
        });
});