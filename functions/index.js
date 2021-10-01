/* eslint-disable no-tabs*/
/* eslint-disable no-undef*/
/* eslint-disable object-curly-spacing*/
/* eslint-disable indent*/
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const sgMail = require("@sendgrid/mail");

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;

sgMail.setApiKey(API_KEY);

exports.uploadNewDoc = functions.https.onCall(async (data, context) => {
  if (!context.auth && !context.auth.token.email) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Must be logged in"
    );
  }

  const msg = {
    to: context.auth.token.email,
    from: "devops@seguridata.com",
    template_id: TEMPLATE_ID,
    dynamic_template_data: {
      subject: context.auth.token.email,
      text: "Sube un nuevo documento",
    },
  };
  await sgMail.send(msg);

  return { success: true };
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
