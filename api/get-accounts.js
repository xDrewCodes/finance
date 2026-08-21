import { adminAuth, db } from "./firebase-admin.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing authorization token"
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        /*
         * Accounts are stored under:
         *
         * users/{uid}/accounts/{accountId}
         */

        const snapshot = await db
            .collection('accounts')
            .where('userId', '==', uid)
            .get();

        const accounts = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
                accountId: doc.id,

                itemId: data.itemId || null,

                institutionName:
                    data.institutionName || "Unknown Institution",

                name: data.name || "Account",

                officialName:
                    data.officialName || null,

                type: data.type || null,

                subtype: data.subtype || null,

                mask: data.mask || null,

                currentBalance:
                    data.currentBalance ?? null,

                availableBalance:
                    data.availableBalance ?? null,

                balanceUpdatedAt:
                    data.balanceUpdatedAt?.toDate?.()?.toISOString() || null
            };
        });

        return res.status(200).json({
            accounts
        });

    } catch (error) {
        console.error("Get accounts error:", error);

        return res.status(500).json({
            error: "Failed to load accounts"
        });
    }
}