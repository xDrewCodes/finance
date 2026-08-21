import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";


function Settings() {

    async function handleSignOut() {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Sign out failed:",
                error
            );

        }

    }


    return (

        <main className="settings-page">

            <h1>Settings</h1>

            <button onClick={handleSignOut}>
                Sign Out
            </button>

        </main>

    );

}


export default Settings;