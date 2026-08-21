
import { Link } from "react-router-dom";

function Nav() {

    return (

        <div className="navbar">
            <Link to="/" className="home">Home</Link>
            <Link to="/tracking" className="tracking">Track</Link>
            <Link to="/transactions" className="transactions">Sort</Link>
            <Link to="/settings" className="settings">Settings</Link>
        </div>

    )

}

export default Nav;