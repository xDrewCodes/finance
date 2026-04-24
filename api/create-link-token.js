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
    const request = {
      user: {
        client_user_id: "drew",
      },
      client_name: "Drew Money",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    };

    const response = await plaidClient.linkTokenCreate(request);

    return res.status(200).json({
      link_token: response.data.link_token,
    });

  } catch (error) {
    console.error("Plaid error:", error.response?.data || error.message);

    return res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
}