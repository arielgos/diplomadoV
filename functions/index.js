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

exports.newProduct = functions.firestore
    .document("products/{docId}")
    .onCreate((snap, context) => {
        const newValue = snap.data();
        const id = newValue.id;
        const name = newValue.name;

        const mailOptions = {
            from: "no-reply <amazing-store@gmail.com>",
            to: "arielg.os@gmail.com",
            subject: "Nuevo producto",
            html: "<p style=\"font-size: 16px;\">Se ha creado un nuevo producto <b>[" + id + "] " + name + "</b></p>"
        };
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });