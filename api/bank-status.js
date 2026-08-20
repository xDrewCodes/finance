import { adminAuth, db } from "./firebaseAdmin.js";

export default async function handler(req, res) {

    try {

        console.log("BANK STATUS REQUEST");

        const authHeader = req.headers.authorization;

        console.log(
            "Has auth header:",
            !!authHeader
        );

        if (!authHeader?.startsWith("Bearer ")) {

            return res.status(401).json({
                error: "Missing Firebase authentication"
            });

        }

        const firebaseToken =
            authHeader.substring(7);

        console.log("Verifying Firebase token...");

        const decodedToken =
            await adminAuth.verifyIdToken(firebaseToken);

        const uid = decodedToken.uid;

        console.log("Firebase UID:", uid);

        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();

        const banks = snapshot.docs.map(doc => ({
            itemId: doc.id,
            institutionName:
                doc.data().institutionName ||
                "Connected Bank"
        }));

        console.log(
            "Found banks:",
            banks.length
        );

        return res.status(200).json({
            hasBanks: banks.length > 0,
            banks
        });

    } catch (error) {

        console.error(
            "BANK STATUS ERROR:",
            error
        );

        return res.status(500).json({
            error: "Failed to check bank status",
            message: error.message
        });

    }
}