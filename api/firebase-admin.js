import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    console.log("Firebase Admin config:");
    console.log("PROJECT_ID:", !!projectId);
    console.log("CLIENT_EMAIL:", !!clientEmail);
    console.log("PRIVATE_KEY:", !!privateKey);

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            "Missing Firebase Admin environment variables"
        );
    }

    initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n")
        })
    });
}

export const adminAuth = getAuth();
export const db = getFirestore();