
import './App.css'
import { useEffect, useState } from 'react'
import PlaidLink from 'react-plaid-link'

function App() {

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
        <div className="checkings">$730</div>
        <div className="savings">$6,432</div>
        <div className="month_pl">+$800</div>
      </header>

      <button onClick={() => open()} disabled={!ready || !linkToken}>
        Connect Bank
      </button>

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
