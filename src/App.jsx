
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
    onSuccess: (public_token) => {
      console.log("PUBLIC TOKEN:", public_token);
    }
  });

  return (
    <>
      <header>
        <div className="pfp">Drew</div>
        <div className="settings">Settings</div>
      </header>

      <section className="summary">
        <div className="summary_filter">All Acounts</div>
        <div className="total_bal"><span className="summary_title">Total Balance</span><br></br> $5,401.94</div>
      </section>

      <div className="bal_breakdown">
        <div className="account_breakdown">Account Overview</div>
        <div className="account_settings">Account Settings</div>
      </div>
      <div className="month_pl">+$800 This Month</div>

      {
        signedIn ?
          <>
            <header>
              <div className="pfp">Drew</div>
              <div className="settings">Settings</div>
            </header>

            <section className="summary">
              <div className="summary_filter">All Acounts</div>
              <div className="total_bal"><span className="summary_title">Total Balance</span><br></br> $5,401.94</div>
            </section>

            <div className="bal_breakdown">
              <div className="account_breakdown">Account Overview</div>
              <div className="account_settings">Account Settings</div>
            </div>
            <div className="month_pl">+$800 This Month</div>
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
