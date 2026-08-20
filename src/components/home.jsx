import React, { useEffect, useState } from "react";

function Home({
    user,
    open,
    ready,
    linkToken,
    getBalances,
    handleSignOut
}) {

    const [bankStatus, setBankStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function checkBanks() {

            try {

                const firebaseToken = await user.getIdToken();

                const response = await fetch("/api/bank-status", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${firebaseToken}`
                    }
                });

                const data = await response.json();

                console.log("BANK STATUS:", data);

            } catch (error) {

                console.error("Failed to check banks:", error);

            } finally {

                setLoading(false);

            }
        }

        checkBanks();

    }, [user]);


    if (loading) {
        return <div>Loading...</div>;
    }


    if (!bankStatus?.hasBanks) {

        return (
            <div>
                <h1>
                    Welcome, {user.displayName}
                </h1>

                <p>
                    Connect a bank account to get started.
                </p>

                <button
                    onClick={open}
                    disabled={!ready || !linkToken}
                >
                    {linkToken
                        ? "Connect Bank"
                        : "Loading..."}
                </button>

                <button onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        );
    }


    return (
        <>
            <header>
                <div className="pfp">
                    <div></div>
                    {user.displayName}
                </div>

                <div className="settings">
                    Settings
                </div>
            </header>

            <section className="summary">

                <div className="summary_filter">
                    All Accounts
                </div>

                <div className="total_bal">
                    <span className="summary_title">
                        Total Balance
                    </span>

                    <br />

                    {/* REAL BALANCE WILL GO HERE */}
                    $0.00
                </div>

            </section>

            <section className="bal_breakdown">
                <div className="account_breakdown">
                    Account Breakdown
                </div>

                <div className="manage_money">
                    Manage Money
                </div>
            </section>

            <h2 className="month_pl_legend">
                Month Recap
            </h2>

            <section className="month_pl">
                {/* REAL DATA WILL GO HERE */}
            </section>

            <button onClick={handleSignOut}>
                Sign Out
            </button>
        </>
    );
}

export default Home;