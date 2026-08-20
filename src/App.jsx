
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaidLink from 'react-plaid-link';

import Home from './components/home'
import Nav from './components/Nav';
import Sort from './components/Sort';

function App() {

  const [signedIn, setSignedIn] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

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

      setSignedIn(true);
      setAccessToken(data.access_token);

    }


  });

  async function getBalances() {

    const response = await fetch("/api/get-balances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken
      }),
    });

    const data = await response.json();

    console.log("BALANCE RESPONSE:", data);

  }

  return (
    <>

      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={
              <Home
                signedIn={signedIn}
                getBalances={getBalances}
                open={open}
                ready={ready}
                linkToken={linkToken}
              />
            }
          />
          
          <Route path="/sort" element={<Sort />} />


        </Routes>

        <Nav />

      </BrowserRouter>

    </>
  )
}

export default App
