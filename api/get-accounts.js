import { adminAuth, db } from "./firebase-admin.js";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        // --------------------------------
        // Authenticate Firebase user
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
        // Get user's Plaid Items
        // --------------------------------

        const itemsSnapshot = await db
            .collection("users")
            .doc(uid)
            .collection("plaidItems")
            .get();


        const institutions = [];


        // --------------------------------
        // Get accounts for each Item
        // --------------------------------

        for (const itemDoc of itemsSnapshot.docs) {

            const itemData = itemDoc.data();

            const itemId = itemDoc.id;


            const accountsSnapshot = await itemDoc.ref
                .collection("accounts")
                .get();


            const accounts = accountsSnapshot.docs.map(
                (accountDoc) => {

                    const data = accountDoc.data();

                    return {

                        accountId:
                            accountDoc.id,

                        name:
                            data.name ||
                            "Account",

                        officialName:
                            data.officialName ||
                            null,

                        type:
                            data.type ||
                            null,

                        subtype:
                            data.subtype ||
                            null,

                        mask:
                            data.mask ||
                            null,

                        currentBalance:
                            data.currentBalance ??
                            null,

                        availableBalance:
                            data.availableBalance ??
                            null,

                        balanceUpdatedAt:
                            data.balanceUpdatedAt
                                ?.toDate?.()
                                ?.toISOString() ||
                            null

                    };

                }
            );


            // --------------------------------
            // Build institution
            // --------------------------------

            institutions.push({

                plaidItemId: itemId,

                institutionId:
                    itemData.institutionId ||
                    null,

                institutionName:
                    itemData.institutionName ||
                    "Unknown Institution",

                institutionLogo:
                    itemData.institutionLogo ||
                    null,

                institutionColor:
                    itemData.institutionColor ||
                    null,

                institutionUrl:
                    itemData.institutionUrl ||
                    null,

                accounts

            });

        }


        // --------------------------------
        // Return data
        // --------------------------------

        return res.status(200).json({
            institutions
        });

    } catch (error) {

        console.error(
            "Get accounts error:",
            error
        );

        return res.status(500).json({
            error: "Failed to load accounts"
        });

    }

}