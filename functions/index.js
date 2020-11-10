const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({
  origin: true,
});

const app = admin.initializeApp();
const firestore = admin.firestore();

const templateHandler = async (req, res) => {
  try {
    if (req.method === "POST") {
      console.log({ body: req.body });
      await firestore.collection("templates").doc(req.body.title).set(req.body);
      return res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError("unknown", error.message);
  }

  throw new functions.https.HttpsError("unavailable");
};

exports.template = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    templateHandler(req, res);
  });
});

const tempalateList = async (req, res) => {
  try {
    const docs = await firestore.collection("templates").get();
    let documents = [];
    docs.forEach((doc) => documents.push(doc.data()));
    res.status(200).send(documents);
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
};

exports.templates = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    tempalateList(req, res);
  });
});
