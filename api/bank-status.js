import { auth, db } from "./firebase-admin.js";

export default async function handler(req, res) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "No authorization header"
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        if (!idToken) {
            return res.status(401).json({
                error: "No Firebase ID token"
            });
        }

        // Verify Firebase user
        const decodedToken = await auth.verifyIdToken(idToken);

        const uid = decodedToken.uid;

        console.log("Firebase UID:", uid);

        // Find Plaid items belonging to this user
        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();

        console.log("Plaid items found:", snapshot.size);

        return res.status(200).json({
            hasBanks: snapshot.size > 0
        });

    } catch (error) {

        console.error("BANK STATUS ERROR:", error);

        return res.status(500).json({
            error: error.message
        });
    }
}