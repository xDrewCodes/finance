
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(config);

export default async function handler(req, res) {
    try {


        // Account filtering isn't required here, but sometimes 
        // it's helpful to see an example. 

        const request: LinkTokenCreateRequest = {
            user: {
                client_user_id: 'user-id',
                phone_number: '+1 415 5550123'
            },
            client_name: 'Personal Finance App',
            products: ['transactions'],
            transactions: {
                days_requested: 730
            },
            country_codes: ['US'],
            language: 'en',
            redirect_uri: 'https://finance-drew.vercel.app',
            account_filters: {
                depository: {
                    account_subtypes: ['checking', 'savings']
                },
                credit: {
                    account_subtypes: ['credit card']
                }
            }
        };
        try {
            const response = await plaidClient.linkTokenCreate(request);
            const linkToken = response.data.link_token;
        } catch (error) {
            // handle error
        }

        res.status(200).json({
            link_token: response.data.link_token,
        });
    } catch (error) {
        console.error("Plaid error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create link token" });
    }
}