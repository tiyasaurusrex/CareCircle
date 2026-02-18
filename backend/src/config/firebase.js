import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./carecircle-4dc64-firebase-adminsdk-fbsvc-6929b213bf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
