import { useState } from "react";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";


function Login() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleGoogleSignIn() {

        setLoading(true);
        setError("");

        try {

            const provider =
                new GoogleAuthProvider();

            await signInWithPopup(
                auth,
                provider
            );

            // We don't need to manually
            // set the user here.
            //
            // onAuthStateChanged() in App.jsx
            // will detect the successful login.

        } catch (error) {

            console.error(
                "Google sign-in failed:",
                error
            );

            setError(
                error.message ||
                "Failed to sign in with Google."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <main className="login-page">

            <h1>Finance</h1>

            <p>
                Sign in to view your finances.
            </p>


            {error && (

                <p className="login-error">
                    {error}
                </p>

            )}


            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
            >

                {loading
                    ? "Signing in..."
                    : "Sign in with Google"
                }

            </button>

        </main>

    );

}


export default Login;