// api/bank-status.js

import { adminAuth, db } from "./firebaseAdmin.js";

export default async function handler(req, res) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing authentication"
            });
        }

        const firebaseToken = authHeader.split("Bearer ")[1];

        const decodedToken = await adminAuth.verifyIdToken(firebaseToken);

        const uid = decodedToken.uid;

        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();

        const banks = snapshot.docs.map(doc => ({
            itemId: doc.id,
            institutionName: doc.data().institutionName || "Connected Bank"
        }));

        return res.status(200).json({
            hasBanks: banks.length > 0,
            banks
        });

    } catch (error) {

        console.error("Bank status error:", error);

        return res.status(500).json({
            error: "Failed to check bank status"
        });
    }
}