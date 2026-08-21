
import { plaidClient } from './plaid.js';
import { adminAuth, db } from './firebase-admin.js';

export default async function handler(req, res) {

    const idToken =
        authHeader.replace("Bearer ", "");
    const decodedToken =
        await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const snap = await db.collection('plaidItems').where('userId', '==', uid).get();

    const accounts = [];


    for (const doc of snap.docs) {

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

                current:
                    account.balances.current,

                available:
                    account.balances.available,

                isoCurrencyCode:
                    account.balances.iso_currency_code

            });

        }

    }

    console.log(accounts)

}