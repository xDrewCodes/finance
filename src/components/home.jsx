
import { Link } from "react-router-dom";

function Home({
    user,
    hasBanks,
    bankLoading,
    balanceData,
    balanceLoading,
    open,
    ready,
    linkToken
}) {

    // User is authenticated but
    // we're still checking Firestore

    if (bankLoading) {

        return (
            <div>
                Checking your accounts...
            </div>
        );

    }


    const formattedBalance =
        balanceData
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(balanceData.totalBalance)
            : "$0.00";

    // User has no banks

    if (!hasBanks) {

        return (

            <main className="no-banks">

                <h1>Welcome, {user?.displayName || "Drew"}</h1>

                <p>
                    Connect your first bank account
                    to start tracking your spending.
                </p>

                <button
                    onClick={() => open()}
                    disabled={!ready || !linkToken}
                >
                    {ready
                        ? "Connect Bank"
                        : "Loading..."
                    }
                </button>

            </main>

        );

    }


    // User has at least one bank

    return (

        <>

            <header>

                <div className="pfp">
                    <div></div>
                    {user?.displayName || "Drew"}
                </div>

                <Link
                    to="/settings"
                    className="settings"
                >
                    Settings
                </Link>

                <Link
                    to="/accounts"
                    className="account_breakdown"
                >
                    Account Breakdown
                </Link>

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

                    {balanceLoading
                        ? "Loading..."
                        : formattedBalance
                    }

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

                <div className="pl_title">

                    <span className="pl_bal">
                        $0.00
                    </span>

                </div>

                <div className="pl_chart">

                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>

                </div>

            </section>

        </>

    );

}

export default Home;