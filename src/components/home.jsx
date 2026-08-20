import React from 'react';

function Home({
    user,
    getBalances,
    open,
    ready,
    linkToken,
    handleSignOut
}) {

    return (
        <>

            <header>
                <div className="pfp">
                    <div></div>
                    {user?.displayName || 'User'}
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

                    $5,401.94
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
                        +1,429.55
                    </span>
                </div>

                <div className="pl_chart">

                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>

                    <div
                        className="pl_chart_block"
                        style={{ background: "#193441" }}
                    ></div>

                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>
                    <div className="pl_chart_block"></div>

                </div>

            </section>


            <div
                className="balances"
                onClick={getBalances}
            >
                Get Balances
            </div>


            <button
                onClick={open}
                disabled={!ready || !linkToken}
            >
                {linkToken ? 'Connect Bank' : 'Loading Plaid...'}
            </button>


            <button onClick={handleSignOut}>
                Sign Out
            </button>

        </>
    );
}

export default Home;