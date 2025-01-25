const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: process.env.FIREBASE_DATABASE_URL
});

const admin = admin.firestore();
module.exports = { admin, db };
