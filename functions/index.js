const functions = require("firebase-functions");
const moment = require("moment");
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();

/**
 * hello world
 */
exports.holaMundo = functions.https
    .onRequest((request, response) => {
        functions.logger.info("Hello logs!" + moment().format(), { structuredData: true });
        response.send("Hello from Firebase! " + moment().format());
    });

/**
 * Subscribe to topic
 */
exports.subscribeTokenToTopic = functions.https
    .onRequest(async (request, response) => {
        response.set("Access-Control-Allow-Origin", "*");
        if (request.method === "OPTIONS") {
            response.end();
        } else if (request.method === "POST") {
            console.log("Data:" + request.body);
            await admin.messaging().subscribeToTopic(request.body.token, request.body.topic)
                .then((response) => {
                    console.log("Successfully subscribed to topic:", response);
                    response.send(true);
                })
                .catch((error) => {
                    console.log("Error subscribing to topic:", error);
                    response.send(false);
                });
        }
    });

/**
 * On new Image
 */
exports.newImage = functions.storage
    .object()
    .onFinalize((object) => {
        const fileName = path.basename(object.name);
        if (!fileName.startsWith("thumb_")) {
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
        } else {
            return console.log('Not a new Image');
        }
    });

/**
 * ResizeImage
 */
exports.resizeImage = functions.storage
    .object()
    .onFinalize(async (object) => {
        const filePath = object.name;
        const fileName = path.basename(filePath);
        if (!fileName.startsWith("thumb_")) {
            const fileBucket = object.bucket;
            const bucket = admin.storage().bucket(fileBucket);
            const tempFilePath = path.join(os.tmpdir(), fileName);
            const metadata = {
                contentType: object.contentType,
            };
            await bucket.file(filePath).download({ destination: tempFilePath });
            functions.logger.log("Image downloaded locally to", tempFilePath);
            // Generate a thumbnail using ImageMagick.
            await spawn("convert", [tempFilePath, "-thumbnail", "200x200>", tempFilePath]);
            functions.logger.log("Thumbnail created at", tempFilePath);
            const thumbFileName = `thumb_${fileName}`;
            const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
            await bucket.upload(tempFilePath, {
                destination: thumbFilePath,
                metadata: metadata,
            });
            return fs.unlinkSync(tempFilePath);
        } else {
            return console.log('Already a Thumbnail.');
        }
    });

/**
 * Sending EMail
 */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agos.pruebas.email@gmail.com',
        pass: 'spam.net1'
    }
});

exports.newProductAvailable = functions.firestore
    .document("products/{docId}")
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();

        if (newValue.status) {

            const payload = {
                notification: {
                    title: "Amazing Store",
                    body: "Nuevo Producto disponible [" + newValue.id + "] " + newValue.name
                }
            };

            await admin.messaging().sendToTopic("amazingstore", payload)
                .then((response) => {
                    console.log("Successfully sent message:", response);
                }).catch((error) => {
                    console.log("Notification sent failed:", error);
                });

            const mailOptions = {
                from: "agos.pruebas.email@gmail.com",
                to: "arielg.os@gmail.com",
                subject: "Nuevo producto",
                html: "<p style=\"font-size: 16px;\">Se ha habilitado un nuevo producto <b>[" + newValue.id + "] " + newValue.name + "</b></p>"
            };

            return await transporter.sendMail(mailOptions, (erro, info) => {
                if (erro) {
                    console.error(erro);
                }
                return console.log('Sended');
            });
        } else {
            return console.log('Not Enabled');
        }
    });

/**
 * Listeners for orders
 */
exports.newOrder = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();

        const payload = {
            notification: {
                title: "Amazing Store",
                body: "Nuevo pedido registrado " + snap.id
            }
        };

        return await admin.messaging().sendToTopic("amazingstore", payload)
            .then((response) => {
                console.log("Successfully sent message:", response);
            }).catch((error) => {
                console.log("Notification sent failed:", error);
            });
    });

exports.updateOrder = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const newStatus = newValue.status;
        let body = "Pedido actualizado " + change.before.id

        if (newStatus == 1) {
            body = "Pedido en Proceso " + change.before.id
        }
        if (newStatus == 2) {
            body = "Pedido Entregado " + change.before.id
        }

        const payload = {
            notification: {
                title: "Amazing Store",
                body: body
            }
        };

        return await admin.messaging().sendToTopic("amazingstore", payload)
            .then((response) => {
                console.log("Successfully sent message:", response);
            }).catch((error) => {
                console.log("Notification sent failed:", error);
            });
    });   