import '../index.css'
import Loading from './Loading'
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImagePopup from './ImagePopup'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { api } from '../utils/Api'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ConfirmPopup from './ConfirmPopup'
import Login from './Login'
import Register from './Register'
import InfoTooltip from './InfoTooltip'
import { apiAuth } from '../utils/ApiAuth'
import ProtectedRoute from './ProtectedRoute'

function App() {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [userAuth, setUserAuth] = useState({})
  const [toolTipMessage, setToolTipMessage] = useState('') // открывает попап и передает сообщение
  const [isErrorToolTip, setIsErrorToolTip] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  // get cards
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getCards()])
        .then(([profileInfo, cards]) => {
          setCurrentUser(profileInfo.data)
          setCards(cards.data)
        })
        .catch((err) => {
          if (loggedIn) {
            setIsErrorToolTip(true)
            setToolTipMessage(`Данные профиля или карточек не обновились. ${err}`)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [loggedIn])


  const [selectedCard, setSelectedCard] = useState({})

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  // buttons functions
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState({})

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardDelete(card) {
    setIsConfirmPopupOpen(true)
    setCardToDelete(card)
  }

  // close popups
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsConfirmPopupOpen(false)
    setSelectedCard({})
    setToolTipMessage('')
  }

  // обработчик клика закрытия попапов
  function handlePopupClose(e) {
    if (e.target === e.currentTarget) {
      closeAllPopups()
    }
  }

  // update profile

  function handleUpdateUser(profile) {
    api
      .addProfile(profile)
      .then((newProfile) => {
        setCurrentUser(newProfile.data)
        closeAllPopups()
      })
      .catch((rej) => console.log(rej))
  }

  // avatar update
  function handleUpdateAvatar(avatar) {
    api
      .updateAvatar(avatar)
      .then((newProfile) => {
        setCurrentUser(newProfile.data)
        closeAllPopups()
      })
      .catch((rej) => console.log(rej))
  }

  // ESC close
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups()
      }
    }
    if (selectedCard.link | isEditProfilePopupOpen | isAddPlacePopupOpen | isEditAvatarPopupOpen | isConfirmPopupOpen) {
      document.addEventListener('keyup', closeByEscape)
    }
    return () => document.removeEventListener('keyup', closeByEscape)
  }, [selectedCard, isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isConfirmPopupOpen])


  function handleCardLike(card) {
    const isLiked = card.likes.some((userId) => userId === currentUser._id)
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard.data : c)))
      })
      .catch((rej) => console.log(rej))
  }

  // remove cards
  function handleConfirm() {
    api
      .deleteCard(cardToDelete._id)
      .then((res) => {
        setCards((cards) => cards.filter((c) => c._id !== cardToDelete._id))
        closeAllPopups()
      })
      .catch((rej) => console.log(rej))
  }

  // add cards
  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard.data, ...cards])
        closeAllPopups()
      })
      .catch((rej) => console.log(rej))
  }

  ///////////////////////////////////////////////////////////////


  function handleRegister({ password, email }) {
    apiAuth
      .register({
        password: password,
        email: email,
      })
      .then((res) => {
        setIsErrorToolTip(false)
        setToolTipMessage('Вы успешно зарегистрировались!')
        history.push('/sign-in')
      })
      .catch((err) => {
        setIsErrorToolTip(true)
        setToolTipMessage(err)
      })
  }


  function handleLogin({ password, email }) {
    apiAuth
      .login({
        password,
        email,
      })
      .then((res) => {
        if (res.message === 'Вход совершен успешно') {
          checkToken()
        }
      })
      .catch((err) => {
        setIsErrorToolTip(true)
        setToolTipMessage(err)
      })
  }


  function checkToken() {
    apiAuth
      .checkToken()
      .then((res) => {
        auth(res.data._id, res.data.email)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  function auth(id, email) {
    setLoggedIn(true)
    setUserAuth({
      id,
      email,
    })
  }


  useEffect(() => {
    loggedIn ? history.push('/') : history.push('/sign-in')
  }, [loggedIn])


  useEffect(() => {
    if (document.cookie.includes('jwt=')) {
      checkToken();
    }
  }, [])


  function handleLogoutButtonClick() {
    apiAuth
      .logout()
      .then((res) => {
        setLoggedIn(false)
        setUserAuth({})
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header userAuth={userAuth} onLogout={handleLogoutButtonClick} />
        <InfoTooltip isError={isErrorToolTip} message={toolTipMessage} onClose={handlePopupClose} />

        <Switch>
          <Route path="/sign-up">
            <Register onSubmit={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login onSubmit={handleLogin} />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            isLoading={isLoading}
            loading={Loading}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
        </Switch>
        {loggedIn && <Footer footerText="© 2021 Mesto Russia" />}
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handlePopupClose} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handlePopupClose} onAddPlace={handleAddPlaceSubmit} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handlePopupClose} onUpdateAvatar={handleUpdateAvatar} />
        <ImagePopup card={selectedCard} onClose={handlePopupClose} />
        <ConfirmPopup isOpen={isConfirmPopupOpen} onClose={handlePopupClose} onConfirm={handleConfirm} />
      </CurrentUserContext.Provider>
    </div>
  )
}
export default App
