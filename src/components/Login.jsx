import { useState } from "react";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            if (isCreating) {

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            } else {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            }

        } catch (error) {

            console.error(error);

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }


    return (

        <main className="login-page">

            <h1>Finance</h1>

            <h2>
                {isCreating
                    ? "Create Account"
                    : "Sign In"
                }
            </h2>


            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />


                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Loading..."
                        : isCreating
                            ? "Create Account"
                            : "Sign In"
                    }

                </button>

            </form>


            <button
                type="button"
                onClick={() => {
                    setIsCreating(!isCreating);
                    setError("");
                }}
            >

                {isCreating
                    ? "Already have an account? Sign In"
                    : "Need an account? Create One"
                }

            </button>

        </main>

    );

}

export default Login;