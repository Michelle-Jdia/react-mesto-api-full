import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Register({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const [passwordRepeatErrorText, setPasswordRepeatErrorText] = useState('')
  const [isPasswordMatch, setIsPasswordMatch] = useState(false)

  function handleChangeEmail(e) {
    setEmail(e.target.value)
  }

  function handleChangePassword(e) {
    setPassword(e.target.value)
  }

  function handleRegisterSubmit(e) {
    e.preventDefault()
    if (isPasswordMatch) {
      onSubmit({
        password,
        email,
      })
    } else {
      setPasswordRepeatErrorText('Пароли не совпадают');
    }
  }

  function handlerChangeVisiblePassword() {
    isVisiblePassword ? setIsVisiblePassword(false) : setIsVisiblePassword(true);
  }

  function handleChangePasswordRepeat(e) {
    setPasswordRepeat(e.target.value)
  }

  useEffect(() => {
    passwordRepeat === password ? setIsPasswordMatch(true) : setIsPasswordMatch(false);
    console.log(passwordRepeat ? true : false)
  }, [passwordRepeat, password])

  useEffect(() => {
    isPasswordMatch ? setPasswordRepeatErrorText('') : setPasswordRepeatErrorText('Пароли не совпадают');
  }, [isPasswordMatch])

  return (
    <form method="POST" className="form" name="register" onSubmit={handleRegisterSubmit}>
      <h3 className="form__title">Регистрация</h3>

      <input
        placeholder="Email"
        type="email"
        className="form__input"
        name="email"
        required
        minLength="2"
        maxLength="40"
        value={email || ''}
        onChange={handleChangeEmail}
      />
      <span className="form__error email-input-error"></span>

      <div className="form__password-overlay">
        <input
          placeholder="Пароль"
          type={isVisiblePassword ? "text" : "password"}
          className="form__input"
          name="password"
          required
          minLength="8"
          maxLength="200"
          value={password || ''}
          onChange={handleChangePassword}
        />
        <span className={`form__password-control${isVisiblePassword ? ' visible' : ''}`} onClick={handlerChangeVisiblePassword}></span>
      </div>
      <span className="form__error password-input-error"></span>

      {!isVisiblePassword && (
        <>
          <input
            placeholder="Повторите пароль"
            type="password"
            className="form__input"
            name="repeat-password"
            required
            value={passwordRepeat || ''}
            onChange={handleChangePasswordRepeat}
          />
          <span className="form__error repeat-password-input-error">{passwordRepeat ? passwordRepeatErrorText : ''}</span>
        </>
      )}


      <button type="submit" className="form__submit-button">
        Зарегистрироваться
      </button>
      <p className="form__text">
        Уже зарегистрированы?{' '}
        <Link to="/sign-in" className="form__link">
          Войти
        </Link>
      </p>
    </form>
  )
}

export default Register
