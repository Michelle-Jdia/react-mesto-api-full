import headerLogo from '../images/logo__header.svg'
import {Link, useLocation} from "react-router-dom";
import React from "react";

function Header({loggedIn, email, handleSignOut}) {
    const {pathname} = useLocation();
    const text = `${pathname === '/sign-in' ? 'Регистрация' : 'Войти'}`;
    const linkRoute = `${pathname === '/sign-in' ? '/sign-up' : '/sign-in'}`;
    return (
        <header className="header">
            <img src={headerLogo} alt="Логотип сайта" className="header__logo"/>
            <div className="header__wrap">
                {loggedIn ? (
                        <>
                            <p className="header__email">{email}</p>
                            <Link className="header__signout" to="" onClick={handleSignOut}>Выйти</Link>
                        </>)
                    : (<Link className="header__link" to={linkRoute}>{text}</Link>)}
            </div>
        </header>
    );
}

export default Header;