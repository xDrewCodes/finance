
import './App.css'
import { useEffect, useState } from 'react'
import PlaidLink from 'react-plaid-link'

function App() {

  const [signedIn, setSignedIn] = useState(false);
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    fetch("/api/create-link-token")
      .then(res => res.json())
      .then(data => setLinkToken(data.link_token));
  }, []);

  const { open, ready } = PlaidLink.usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      const response = await fetch("/api/exchange-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token,
        }),
      });

      const data = await response.json();

      console.log("Exchange result:", data);

      setSignedIn(true);
    }
  });

  return (
    <>


      {
        signedIn ?
          <>
            <header>
              <div className="pfp"><div></div>Drew</div>
              <div className="settings">Settings</div>
            </header>

            <section className="summary">
              <div className="summary_filter">All Acounts</div>
              <div className="total_bal"><span className="summary_title">Total Balance</span><br></br> $5,401.94</div>
            </section>

            <section className="bal_breakdown">
              <div className="account_breakdown">Account Breakdown</div>
              <div className="manage_money">Manage Money</div>
            </section>


            <h2 className="month_pl_legend">Month Recap</h2>
            <section className="month_pl">
              <div className="pl_title">
                <span className="pl_bal">+1,429.55</span>
              </div>
              <div className="pl_chart">
                <div className="pl_chart_block"></div>
                <div className="pl_chart_block"></div>
                <div className="pl_chart_block"></div>
                <div className="pl_chart_block" style={{ background: "#193441" }}></div>
                <div className="pl_chart_block"></div>
                <div className="pl_chart_block"></div>
                <div className="pl_chart_block"></div>
              </div>
            </section>
          </>
          :
          <button onClick={() => open()} disabled={!ready || !linkToken}>
            Connect Bank
          </button>
      }

      <div className="navbar">
        <div className="home">Home</div>
        <div className="tracking">Track</div>
        <div className="transactions">Sort</div>
        <div className="settings">Settings</div>
      </div>
    </>
  )
}

export default App
