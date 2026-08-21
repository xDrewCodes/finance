
import { Link } from "react-router-dom";

function Nav() {

    return (

        <div className="navbar">
            <Link to="/" className="home">Home</Link>
            <Link to="/accounts" className="accounts">Manage</Link>
            <Link to="/sort" className="sort">Sort</Link>
            <Link to="/settings" className="settings">Settings</Link>
        </div>

    )

}

export default Nav;