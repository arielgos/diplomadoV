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

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 2
    };

    admin.messaging().sendToTopic("amazingstore", payload, options).then((response) => {
        functions.logger.info("Successfully sent message: " + response, { structuredData: true });
        return { success: true };
    }).catch((error) => {
        return { error: error.code };
    });
});