import { useEffect, useState } from "react";


function Accounts({ user, open, ready, linkToken }) {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function loadAccounts() {

        try {

            setLoading(true);
            setError("");

            const token = await user.getIdToken();

            const response = await fetch("/api/get-accounts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load accounts"
                );
            }

            setAccounts(data.accounts || []);

        } catch (error) {

            console.error(
                "Failed to load accounts:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        if (user) {
            loadAccounts();
        }

    }, [user]);


    /*
     * Group accounts by financial institution.
     */
    const groupedAccounts = accounts.reduce(
        (groups, account) => {

            const institution =
                account.institutionName || "Unknown Institution";

            if (!groups[institution]) {
                groups[institution] = [];
            }

            groups[institution].push(account);

            return groups;

        },
        {}
    );


    function formatBalance(balance) {

        if (balance === null || balance === undefined) {
            return "Balance unavailable";
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(balance);
    }


    function formatUpdatedTime(timestamp) {

        if (!timestamp) {
            return "Balance not yet recorded";
        }

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "Balance not yet recorded";
        }

        return `Updated ${date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        )} at ${date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        )}`;
    }


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

                <div className="institutions">

                    {Object.entries(groupedAccounts).map(
                        ([institutionName, institutionAccounts]) => (

                            <section
                                className="institution-section"
                                key={institutionName}
                            >

                                <div className="institution-header">

                                    <h2>
                                        {institutionName}
                                    </h2>

                                </div>


                                <div className="account-list">

                                    {institutionAccounts.map(
                                        (account) => (

                                            <div
                                                className="account-card"
                                                key={account.accountId}
                                            >

                                                <div className="account-card-top">

                                                    <div>

                                                        <strong>
                                                            {account.name}
                                                        </strong>

                                                        {account.officialName &&
                                                            account.officialName !== account.name && (
                                                                <div>
                                                                    {account.officialName}
                                                                </div>
                                                            )
                                                        }

                                                    </div>


                                                    {account.mask && (

                                                        <span>
                                                            •••• {account.mask}
                                                        </span>

                                                    )}

                                                </div>


                                                <div className="account-card-middle">

                                                    <div className="account-type">

                                                        {account.subtype ||
                                                            account.type ||
                                                            "Account"
                                                        }

                                                    </div>

                                                    <div className="account-balance">

                                                        {formatBalance(
                                                            account.current
                                                        )}

                                                    </div>

                                                </div>


                                                <div className="account-card-bottom">

                                                    {formatUpdatedTime(
                                                        account.balanceUpdatedAt
                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )
                    )}

                </div>

            )}


            <button
                onClick={() => open()}
                disabled={!ready || !linkToken}
            >

                {!ready || !linkToken
                    ? "Loading..."
                    : "+ Add Bank"
                }

            </button>


        </main>

    );
}


export default Accounts;