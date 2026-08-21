import { adminAuth, db } from "./firebase-admin.js";
import { plaidClient } from "./plaid.js";


export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        // --------------------------------
        // 1. Get Firebase ID token
        // --------------------------------

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Missing authorization header"
            });
        }

        const idToken =
            authHeader.replace("Bearer ", "");

        const decodedToken =
            await adminAuth.verifyIdToken(idToken);

        const uid = decodedToken.uid;


        // --------------------------------
        // 2. Get Plaid public token
        // --------------------------------

        const {
            public_token,
            metadata
        } = req.body;

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


        // --------------------------------
        // 4. Get institution information
        // --------------------------------

        const institution =
            metadata?.institution || null;


        // --------------------------------
        // 5. Save Plaid Item
        // --------------------------------

        await db
            .collection("plaidItems")
            .doc(item_id)
            .set({

                userId: uid,

                itemId: item_id,

                accessToken: access_token,

                institutionId:
                    institution?.institution_id || null,

                institutionName:
                    institution?.name || null,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            });


        // --------------------------------
        // 6. Return safe response
        // --------------------------------

        return res.status(200).json({

            success: true,

            itemId: item_id,

            institutionName:
                institution?.name || null

        });

    } catch (error) {

        console.error(
            "PLAID EXCHANGE ERROR:",
            error
        );

        return res.status(500).json({
            error: error.message
        });

    }

}