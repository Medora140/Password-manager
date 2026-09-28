const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="design"> &lt; </span>
        Pass
        <span className="design">OP / &gt;</span>
      </div>
      <ul className="nav-bar">
        <li className="nav-bar_i">
          <a href="/">Home</a>
        </li>
        <li className="nav-bar_i">
          <a href="#">About</a>
        </li>
        <li className="nav-bar_i">
          <a href="#">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
