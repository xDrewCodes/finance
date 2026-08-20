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
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({
                error: "Missing access_token",
            });
        }

        const response = await plaidClient.accountsGet({
            access_token,
        });

        const accounts = response.data.accounts;

        return res.status(200).json({
            success: true,
            accounts,
        });

    } catch (error) {
        console.error("Plaid accounts error:");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("Message:", error.message);

        return res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
}