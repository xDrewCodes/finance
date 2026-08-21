import { adminAuth, db } from "./firebase-admin.js";
import { plaidClient } from "./plaid.js";


export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    try {

        // -------------------------
        // Authenticate Firebase user
        // -------------------------

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                error:
                    "Missing authorization header"
            });

        }


        const idToken =
            authHeader.replace(
                "Bearer ",
                ""
            );


        const decodedToken =
            await adminAuth.verifyIdToken(
                idToken
            );


        const uid =
            decodedToken.uid;


        // -------------------------
        // Get user's Plaid Items
        // -------------------------

        const snapshot =
            await db
                .collection("plaidItems")
                .where(
                    "userId",
                    "==",
                    uid
                )
                .get();


        const accounts = [];


        // -------------------------
        // Get accounts from Plaid
        // -------------------------

        for (
            const doc of snapshot.docs
        ) {

            const item =
                doc.data();


            const response =
                await plaidClient
                    .accountsGet({
                        access_token:
                            item.accessToken
                    });


            for (
                const account
                of response.data.accounts
            ) {

                accounts.push({

                    accountId:
                        account.account_id,

                    itemId:
                        item.itemId,

                    institutionName:
                        item.institutionName,

                    name:
                        account.name,

                    officialName:
                        account.official_name,

                    type:
                        account.type,

                    subtype:
                        account.subtype,

                    mask:
                        account.mask

                });

            }

        }


        return res.status(200).json({
            accounts
        });


    } catch (error) {

        console.error(
            "GET ACCOUNTS ERROR:",
            error
        );


        return res.status(500).json({
            error:
                error.message
        });

    }

}