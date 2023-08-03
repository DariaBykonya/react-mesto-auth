import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ loggedIn, email, onSignOut, children }) {
    return (
        <header className="page-content header">
            {loggedIn ? (
            <>
                <a href="/" className="header__link">
                <img
                    className="logo header__logo"
                    src={logo}
                    alt="Логотип Место"
                />
                </a>
                <div className="header__navigate">
                    <p className="header__email">{email}</p>
                <Link to='/signin' className='header__link-exit'>
                    <p className='header__navigate-title' onClick={onSignOut}>Выйти</p>
                </Link>
                </div>
            </>
) : (
            <>
                <a href="/" className="header__link">
                <img
                    className="logo header__logo"
                    src={logo}
                    alt="Логотип Место"
                />
                </a>
                {children}
            </>
)}
            
            
      </header>
  )};
  
  export default Header