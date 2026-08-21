import { adminAuth, db } from "./firebase-admin.js";
import { plaidClient } from "./plaid.js";


export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        // --------------------------------
        // 1. Verify Firebase user
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
        // 2. Find user's Plaid Items
        // --------------------------------

        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();


        if (snapshot.empty) {

            return res.status(200).json({

                hasBanks: false,

                accounts: [],

                totalBalance: 0

            });

        }


        // --------------------------------
        // 3. Get balances from every bank
        // --------------------------------

        const accounts = [];


        for (const doc of snapshot.docs) {

            const plaidItem = doc.data();


            const response =
                await plaidClient.accountsBalanceGet({
                    access_token:
                        plaidItem.accessToken
                });


            const plaidAccounts =
                response.data.accounts;


            for (const account of plaidAccounts) {

                accounts.push({

                    accountId:
                        account.account_id,

                    itemId:
                        plaidItem.itemId,

                    institutionName:
                        plaidItem.institutionName,

                    name:
                        account.name,

                    officialName:
                        account.official_name,

                    type:
                        account.type,

                    subtype:
                        account.subtype,

                    mask:
                        account.mask,

                    currentBalance:
                        account.balances.current,

                    availableBalance:
                        account.balances.available,

                    isoCurrencyCode:
                        account.balances.iso_currency_code,
                    userId:
                        uid

                });

            }

        }


        // --------------------------------
        // 4. Calculate total balance
        // --------------------------------

        let totalBalance = 0;


        for (const account of accounts) {

            const balance =
                account.current || 0;


            // Credit cards represent money owed,
            // so subtract them from net balance.

            if (account.type === "credit") {

                totalBalance -= balance;

            } else {

                totalBalance += balance;

            }

        }


        // --------------------------------
        // 5. Return data
        // --------------------------------

        for ( const acc of accounts ) {

            await db
                .collection('accounts')
                .doc(acc.accountId)
                .set(acc)

        }

        return res.status(200).json({

            hasBanks: true,

            totalBalance,

            accounts

        });

    } catch (error) {

        console.error(
            "GET BALANCES ERROR:",
            error
        );

        return res.status(500).json({
            error: error.message
        });

    }

}