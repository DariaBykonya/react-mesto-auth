import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ link, titleNavigate }) {
    return (
        <header className="page-content header">
            <a href="/" className="header__link">
            <img
                className="logo header__logo"
                src={logo}
                alt="Логотип Место"
            />
            </a>
            <Link to={link} className="header__navigate">
                <p className='header__navigate-title'>{titleNavigate}</p>
            </Link>
      </header>
  )};
  
  export default Header



