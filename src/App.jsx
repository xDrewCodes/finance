import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaidLink from 'react-plaid-link';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

import Home from './components/home';
import Nav from './components/Nav';
import Sort from './components/Sort';


function App() {

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [hasBanks, setHasBanks] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);

  const [linkToken, setLinkToken] = useState(null);


  // Firebase authentication

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        setUser(currentUser);
        setAuthLoading(false);

      }
    );

    return unsubscribe;

  }, []);


  // Get Plaid Link token

  useEffect(() => {

    if (!user) {
      setLinkToken(null);
      return;
    }

    fetch("/api/create-link-token")
      .then(res => res.json())
      .then(data => {
        setLinkToken(data.link_token);
      });

  }, [user]);


  // Check whether user has banks

  async function checkBankStatus() {

    if (!user) return;

    try {

      setBankLoading(true);

      const firebaseToken =
        await user.getIdToken();

      const response = await fetch(
        "/api/bank-status",
        {
          headers: {
            Authorization:
              `Bearer ${firebaseToken}`
          }
        }
      );

      const data =
        await response.json();

      console.log("BANK STATUS:", data);

      setHasBanks(data.hasBanks);

    } catch (error) {

      console.error(
        "Failed to check banks:",
        error
      );

    } finally {

      setBankLoading(false);

    }

  }


  // Check banks whenever user signs in

  useEffect(() => {

    if (user) {
      checkBankStatus();
    } else {
      setHasBanks(false);
    }

  }, [user]);


  // Plaid Link

  const { open, ready } =
    PlaidLink.usePlaidLink({

      token: linkToken,

      onSuccess: async (public_token, metadata) => {

        try {

          const firebaseToken =
            await user.getIdToken();

          const response = await fetch(
            "/api/exchange-token",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseToken}`
              },

              body: JSON.stringify({
                public_token,
                metadata
              })
            }
          );

          const data = await response.json();

          console.log("PLAID EXCHANGE:", data);

          if (!response.ok) {
            throw new Error(
              data.error || "Failed to connect bank"
            );
          }

          // Refresh bank status
          await checkBankStatus();

        } catch (error) {

          console.error(
            "Bank connection failed:",
            error
          );

        }
      }

    });


  if (authLoading) {
    return <div>Loading...</div>;
  }


  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              user={user}
              hasBanks={hasBanks}
              bankLoading={bankLoading}
              open={open}
              ready={ready}
              linkToken={linkToken}
            />
          }
        />

        <Route
          path="/sort"
          element={<Sort />}
        />

      </Routes>

      {user && <Nav />}

    </BrowserRouter>

  );

}

export default App;