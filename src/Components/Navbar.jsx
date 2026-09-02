import logo from "../assets/logo.png";
import profilepic from "../assets/profile.jpeg";
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
        <div className="logo-section">
            <img src={logo} alt="TaskFlow logo" />
            <h1>TaskFlow</h1>
        </div>
        <div className="profile-section">
            <img src={profilepic} alt="profile" />
            <h2>Parth</h2>
        </div>
    </nav>
  );
}
export default Navbar;
