import { useEffect, useState } from "react";

function Accounts({
    user,
    open,
    ready,
    linkToken
}) {

    const [institutions, setInstitutions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    async function loadAccounts() {

        try {

            setLoading(true);
            setError("");


            const token =
                await user.getIdToken();


            const response =
                await fetch("/api/get-accounts", {

                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }

                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to load accounts"
                );

            }


            console.log(
                "GET ACCOUNTS RESPONSE:",
                data
            );


            setInstitutions(
                data.institutions || []
            );


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


    function formatBalance(balance) {

        if (
            balance === null ||
            balance === undefined
        ) {

            return "Balance unavailable";

        }


        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        ).format(balance);

    }


    function formatUpdatedTime(timestamp) {

        if (!timestamp) {
            return "Balance not yet recorded";
        }


        const date =
            new Date(timestamp);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

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
            <main className="accounts-page">

                <h1>Accounts</h1>

                <p>
                    Loading accounts...
                </p>

            </main>
        );

    }


    if (error) {

        return (
            <main className="accounts-page">

                <h1>Accounts</h1>

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


            {institutions.length === 0 ? (

                <p>
                    No accounts connected.
                </p>

            ) : (

                <div className="institutions">

                    {institutions.map(
                        (institution) => (

                            <section
                                className="institution-section"
                                key={
                                    institution.plaidItemId
                                }
                            >

                                {/* Institution header */}

                                <div className="institution-header">

                                    {institution.institutionLogo ? (

                                        <img
                                            className="institution-logo"
                                            src={
                                                `data:image/png;base64,${institution.institutionLogo}`
                                            }
                                            alt=""
                                        />

                                    ) : (

                                        <div
                                            className="institution-logo-fallback"
                                            style={{
                                                backgroundColor:
                                                    institution.institutionColor ||
                                                    "#e5e5e5"
                                            }}
                                        >
                                            $
                                        </div>

                                    )}


                                    <div>

                                        <h2>
                                            {
                                                institution.institutionName
                                            }
                                        </h2>

                                        {institution.institutionUrl && (

                                            <a
                                                href={
                                                    institution.institutionUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="institution-link"
                                            >
                                                Visit website
                                            </a>

                                        )}

                                    </div>

                                </div>


                                {/* Accounts */}

                                {institution.accounts.length === 0 ? (

                                    <p>
                                        No accounts found for this bank.
                                    </p>

                                ) : (

                                    <div className="account-list">

                                        {institution.accounts.map(
                                            (account) => (

                                                <div
                                                    className="account-card"
                                                    key={
                                                        account.accountId
                                                    }
                                                >

                                                    <div className="account-card-top">

                                                        <div>

                                                            <strong>
                                                                {
                                                                    account.name
                                                                }
                                                            </strong>


                                                            {account.officialName &&
                                                                account.officialName !==
                                                                account.name && (

                                                                    <div>
                                                                        {
                                                                            account.officialName
                                                                        }
                                                                    </div>

                                                                )}

                                                        </div>


                                                        {account.mask && (

                                                            <span>
                                                                •••• {
                                                                    account.mask
                                                                }
                                                            </span>

                                                        )}

                                                    </div>


                                                    <div className="account-card-middle">

                                                        <div className="account-type">

                                                            {
                                                                account.subtype ||
                                                                account.type ||
                                                                "Account"
                                                            }

                                                        </div>


                                                        <div className="account-balance">

                                                            {formatBalance(
                                                                account.currentBalance
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

                                )}

                            </section>

                        )
                    )}

                </div>

            )}


            <button
                onClick={() => open()}
                disabled={
                    !ready ||
                    !linkToken
                }
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