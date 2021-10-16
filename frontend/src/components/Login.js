import React from 'react';


function Login({authorization}) {
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

        authorization({email, password})
    }


    return (
        <section className="start-screen">
            <h1 className="start-screen__title">Вход</h1>
            <form onSubmit={handleSubmit} className="start-screen__form">
                <input value={valueEmail} className="start-screen__input" placeholder="Email"
                       onChange={handleChangeEmail}/>
                <input value={valuePassword} className="start-screen__input" placeholder="Пароль"
                       onChange={handleChangePassword}/>
                <button className="start-screen__submit">Войти</button>
            </form>
        </section>
    );
}

export default Login;