import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Početak</Link>
      <Link to="/prijava">Prijava</Link>
    </nav>
  );
}

export default Navbar;