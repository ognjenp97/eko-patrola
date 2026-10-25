import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthToken, setAuthToken } from '../lib/api';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-white/10 text-white' : 'text-emerald-100 hover:text-white'
  }`;

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getAuthToken());

  const handleLogout = () => {
    setAuthToken(null);
    navigate('/');
  };

  return (
    <header className="bg-emerald-950 px-4 py-3">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-white font-bold tracking-wide">
          EKO PATROLA
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Početak
          </NavLink>
          <NavLink to="/prijava" className={linkClass}>
            Prijava
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:text-white transition-colors"
              >
                Odjava
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Prijava administratora
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
