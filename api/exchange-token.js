import { adminAuth, db } from "./firebase-admin.js";
import { plaidClient } from "./plaid.js";
import { Timestamp } from "firebase-admin/firestore";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        // --------------------------------
        // 1. Verify Firebase user
        // --------------------------------

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing authorization token"
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        const decodedToken =
            await adminAuth.verifyIdToken(idToken);

        const uid = decodedToken.uid;

        // --------------------------------
        // 2. Get Plaid public token
        // --------------------------------

        const {
            public_token,
            metadata
        } = req.body || {};

        if (!public_token) {
            return res.status(400).json({
                error: "Missing public_token"
            });
        }

        // --------------------------------
        // 3. Exchange public token
        // --------------------------------

        const plaidResponse =
            await plaidClient.itemPublicTokenExchange({
                public_token
            });

        const {
            access_token,
            item_id
        } = plaidResponse.data;

        if (!access_token || !item_id) {
            throw new Error(
                "Plaid did not return an access token or item ID"
            );
        }

        // --------------------------------
        // 4. Get institution information
        // --------------------------------

        const institution =
            metadata?.institution || null;

        const institutionId =
            institution?.institution_id || null;

        const institutionName =
            institution?.name || "Unknown Institution";

        // --------------------------------
        // 5. Save Plaid Item
        // --------------------------------

        const itemRef = db
            .collection("plaidItems")
            .doc(item_id);

        const existingItem =
            await itemRef.get();

        const now = Timestamp.now();

        const itemData = {
            userId: uid,

            itemId: item_id,

            // IMPORTANT:
            // This is server-side only.
            // Never send this back to the frontend.
            accessToken: access_token,

            institutionId,
            institutionName,

            updatedAt: now
        };

        // Only create createdAt when this is
        // a brand-new Plaid Item.
        if (!existingItem.exists) {
            itemData.createdAt = now;
        }

        await itemRef.set(
            itemData,
            { merge: true }
        );

        // --------------------------------
        // 6. Return safe response
        // --------------------------------

        return res.status(200).json({
            success: true,
            itemId: item_id,
            institutionId,
            institutionName
        });

    } catch (error) {

        console.error(
            "PLAID EXCHANGE ERROR:",
            error
        );

        return res.status(500).json({
            error:
                error?.response?.data?.error_message ||
                error?.message ||
                "Failed to exchange Plaid token"
        });
    }
}