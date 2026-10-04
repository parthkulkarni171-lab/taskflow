import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <p className="header-label">TASK MANAGEMENT</p>

        <h1>
          Turn plans into <span>progress.</span>
        </h1>

        <p className="header-description">
          Stay organized, focus on what matters, and get things done.
        </p>
      </div>
    </header>
  );
}

export default Header;