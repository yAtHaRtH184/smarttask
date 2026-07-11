import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚡</span>
        <Link to="/" className="navbar-title">SmartTask</Link>
      </div>
      {user && (
        <div className="navbar-right">
          <div className="navbar-user">
            <div className="avatar">{user.name?.[0]?.toUpperCase() ?? 'U'}</div>
            <span className="navbar-username">{user.name}</span>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
