import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaidLink from 'react-plaid-link';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Home from './components/home';
import Nav from './components/Nav';
import Sort from './components/Sort';
import Login from './components/Login';

function App() {

  // Firebase authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Plaid
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  /*
   * Watch Firebase authentication state
   */
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;

  }, []);

  /*
   * Get a Plaid Link token.
   *
   * We only need to do this when the user is signed in.
   */
  useEffect(() => {

    if (!user) {
      setLinkToken(null);
      return;
    }

    fetch('/api/create-link-token')
      .then(res => res.json())
      .then(data => {
        console.log('PLAID LINK TOKEN:', data.link_token);
        setLinkToken(data.link_token);
      })
      .catch(error => {
        console.error('Failed to create Link token:', error);
      });

  }, [user]);

  /*
   * Plaid Link
   */
  const { open, ready } = PlaidLink.usePlaidLink({

    token: linkToken,

    onSuccess: async (public_token, metadata) => {

      try {

        const firebaseToken = await user.getIdToken();

        const response = await fetch("/api/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${firebaseToken}`
          },
          body: JSON.stringify({
            public_token
          })
        });

        const data = await response.json();

        console.log('EXCHANGE RESPONSE:', data);

        if (!response.ok) {
          console.error('Token exchange failed:', data);
          return;
        }

      } catch (error) {

        console.error('Plaid exchange error:', error);

      }

    }

  });

  /*
   * Get account balances.
   *
   * TEMPORARY:
   * This sends the access token from React to the backend.
   *
   * Once Firestore is set up, the backend will retrieve the
   * access token itself.
   */
  async function getBalances() {

    if (!accessToken) {
      console.log('No access token available.');
      return;
    }

    try {

      const response = await fetch('/api/get-balances', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          access_token: accessToken,
        }),
      });

      const data = await response.json();

      console.log('BALANCE RESPONSE:', data);

    } catch (error) {

      console.error('Balance request failed:', error);

    }

  }

  /*
   * Sign out of Firebase
   */
  async function handleSignOut() {

    try {

      await signOut(auth);

      setAccessToken(null);
      setLinkToken(null);

    } catch (error) {

      console.error('Sign out failed:', error);

    }

  }

  /*
   * Don't render the application until Firebase has determined
   * whether the user is signed in.
   */
  if (authLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            user ? (
              <Home
                user={user}
                open={open}
                ready={ready}
                linkToken={linkToken}
                getBalances={getBalances}
                handleSignOut={handleSignOut}
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/sort"
          element={
            user ? (
              <Sort />
            ) : (
              <Login />
            )
          }
        />

      </Routes>

      {user && <Nav />}

    </BrowserRouter>

  );
}

export default App;