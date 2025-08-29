import { NavLink } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header({ pageTitle }) {
  const { user } = useAuth();

  const handleSignOut = () => {
    if (window.confirm('Deseja sair, tem certeza?')) {
      auth.signOut();
    }
  };

  return (
    <header className="header">
      <div className="header-nav">
        <NavLink to="/">
          <button className="btn">Lista</button>
        </NavLink>
        <NavLink to="/user-prof">
          <button className="btn">Perfil</button>
        </NavLink>
      </div>

      <h2>{pageTitle}</h2>

      {user && (
        <div className="header-user">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "Usuário"} />
          ) : (
            <i className="fa fa-user" aria-hidden="true"></i>
          )}
          <span>{user.displayName || user.email}</span>
          <button onClick={handleSignOut}>Sair</button>
        </div>
      )}
    </header>
  );
}

export default Header;
