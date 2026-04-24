
import './App.css'

function App() {

  async function handleConnectBank() {
    const response = await fetch("/api/create-link-token");
    console.log(response.body)
  }

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
