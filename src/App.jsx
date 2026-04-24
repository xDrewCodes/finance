
import './App.css'
import useState from 'react'

function App() {

  const [linkToken, setLinkToken] = useState();

  function handleConnectBank() {
    const response = fetch("/api/create-link-token")
      .then(res => res.json())
      .then(data => setLinkToken(data.link_token))
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
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

      <button onClick={handleConnectBank}>
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
