import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
} = process.env;

export const isFirebaseAdminConfigured =
  Boolean(FIREBASE_ADMIN_PROJECT_ID) &&
  Boolean(FIREBASE_ADMIN_CLIENT_EMAIL) &&
  Boolean(FIREBASE_ADMIN_PRIVATE_KEY);

if (isFirebaseAdminConfigured && !getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = isFirebaseAdminConfigured ? getFirestore() : null;
