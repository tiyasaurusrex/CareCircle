import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const defaultServiceAccountPath = path.join(currentDirPath, "carecircle-4dc64-firebase-adminsdk-fbsvc-6929b213bf.json");
const configuredServiceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
  : defaultServiceAccountPath;

if (!fs.existsSync(configuredServiceAccountPath)) {
  throw new Error(`Firebase service account file not found at: ${configuredServiceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(configuredServiceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
