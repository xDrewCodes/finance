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
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    try {
        const { public_token } = req.body;

        if (!public_token) {
            return res.status(400).json({
                error: "Missing public_token",
            });
        }

        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const { access_token, item_id } = response.data;

        // IMPORTANT:
        // Store these in your database here.
        //
        // access_token → encrypted/server-side storage
        // item_id      → identifies the Plaid Item

        return res.status(200).json({
            success: true,
            item_id,
        });

    } catch (error) {
        console.error(
            "Plaid token exchange error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            error: "Failed to exchange public token",
        });
    }
}