import { adminAuth, db } from "./firebase-admin.js";
import { plaidClient } from "./plaid.js";

export default async function handler(req, res) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing Firebase authentication"
            });
        }

        const firebaseToken = authHeader.split("Bearer ")[1];

        const decodedToken = await adminAuth.verifyIdToken(firebaseToken);

        const uid = decodedToken.uid;

        const { public_token } = req.body;

        if (!public_token) {
            return res.status(400).json({
                error: "Missing public_token"
            });
        }

        // Exchange Plaid public token for access token
        const response = await plaidClient.itemPublicTokenExchange({
            public_token
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Store the Plaid connection
        await db.collection("plaidItems").doc(itemId).set({
            userId: uid,
            accessToken: accessToken,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(200).json({
            success: true,
            itemId
        });

    } catch (error) {

        console.error(
            "Exchange token error:",
            error.response?.data || error
        );

        return res.status(500).json({
            error: "Failed to exchange token"
        });
    }
}