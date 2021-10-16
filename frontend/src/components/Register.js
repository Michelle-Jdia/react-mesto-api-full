import React from 'react';
import {Link} from "react-router-dom";


function Register({registration}) {

    const [valueEmail, setValueEmail] = React.useState('')
    const [valuePassword, setValuePassword] = React.useState('')

    function handleChangeEmail(evt) {
        setValueEmail(evt.target.value)
    }

    function handleChangePassword(evt) {
        setValuePassword(evt.target.value)
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        const email = valueEmail;
        const password = valuePassword;

        registration({email,password})
    }

    return (
        <section className="start-screen">
            <h1 className="start-screen__title">Регистрация</h1>
            <form onSubmit={handleSubmit} className="start-screen__form">
                <input value={valueEmail} onChange={handleChangeEmail} type="email" className="start-screen__input"
                       placeholder="Email"/>
                <input value={valuePassword} onChange={handleChangePassword} type="password"
                       className="start-screen__input" placeholder="Пароль"/>
                <button className="start-screen__submit">Зарегестрироваться</button>
            </form>
            <Link className="start-screen__login" to="/sign-in"> Уже зарегестрированы? Войти</Link>
        </section>
    );
}

export default Register;