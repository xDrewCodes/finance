import { useEffect, useState } from "react";


function Accounts({ user, open, ready, linkToken }) {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function loadAccounts() {

        try {

            setLoading(true);
            setError("");

            const token =
                await user.getIdToken();


            const response =
                await fetch(
                    "/api/get-accounts",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to load accounts"
                );

            }


            setAccounts(
                data.accounts || []
            );

        } catch (error) {

            console.error(
                "Failed to load accounts:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        if (user) {
            loadAccounts();
        }

    }, [user]);


    if (loading) {

        return (
            <main>
                Loading accounts...
            </main>
        );

    }


    if (error) {

        return (
            <main>
                <p>
                    Failed to load accounts.
                </p>

                <p>
                    {error}
                </p>
            </main>
        );

    }


    return (

        <main className="accounts-page">

            <h1>Accounts</h1>


            {accounts.length === 0 ? (

                <p>
                    No accounts connected.
                </p>

            ) : (

                accounts.map((account) => (

                    <div
                        className="account-card"
                        key={account.accountId}
                    >

                        <div>

                            <strong>
                                {account.name}
                            </strong>

                            <div>
                                {account.institutionName}
                            </div>

                            <div>
                                {account.type}
                                {" • "}
                                {account.subtype}
                            </div>

                        </div>


                        <div>

                            {account.mask && (
                                <span>
                                    •••• {account.mask}
                                </span>
                            )}

                        </div>

                    </div>

                ))

            )}


            <button
                onClick={() => open()}
                disabled={!ready || !linkToken}
            >

                {ready
                    ? "+ Add Bank"
                    : "Loading..."
                }

            </button>

        </main>

    );

}


export default Accounts;