
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

function Login() {

    async function handleGoogleLogin() {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(
                auth,
                provider
            );

            console.log("Firebase user:", result.user);

        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return (
        <div>
            <h1>Sign In</h1>

            <button onClick={handleGoogleLogin}>
                Continue with Google
            </button>
        </div>
    );
}

export default Login;