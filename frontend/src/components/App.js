import React from 'react'
import Header from "./Header";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm"
import ImagePopup from "./ImagePopup"
import registrationOk from '../images/authorization-ok.svg'
import registrationWrong from '../images/authorization-bad.svg'

import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {Route, Switch, Redirect, useHistory} from 'react-router-dom'

import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from '../utils/auth';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false)

  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({_id: null, avatar: ''});

  const [loggedIn, setLoggedIn] = React.useState(false)
  const [message, setMessage] = React.useState({iconPath: '', text: ''})
  const [email, setEmail] = React.useState('')
  const history = useHistory();

  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then(cardList => {
          setCards(cardList);

        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [loggedIn])

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((currentCard) => currentCard._id === card._id ? newCard : currentCard))
      })
      .catch((err) => {
        console.log(err)
      })
    api.getUserInfo()
      .then((user) => {
        console.log(user.data)
      })
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
        const newCards = cards.filter((elem) => elem !== card);
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((user) => {
          setCurrentUser(user.data)
          console.log(user.data)
        })
        .catch((err) => {
          console.log(err)
        });
    }
  }, [loggedIn])

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/')
        })
        .catch(err => console.log(err))
    }
  }, [history])


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setImagePopupOpen(false)
    setSelectedCard({})
    setIsTooltipOpen(false)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setImagePopupOpen(true)
  }

  function handleUpdateUser({name, about}) {
    api.editUserInfo(name, about)
      .then(() => {
        const updatedUser = {...currentUser};
        updatedUser.name = name;
        updatedUser.about = about;
        setCurrentUser({...updatedUser});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleUpdateAvatar({avatar}) {
    api.editUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleAddPlaceSubmit({name, link}) {
    api.addCard(name, link)
      .then((card) => {
        setCards([...cards, card]);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleInfoTooltipOpen() {
    setIsTooltipOpen(true)
  }

  function handleInfoTooltipContent({iconPath, text}) {
    setMessage({iconPath: iconPath, text: text})
  }

  function handleSignOut() {
    setCurrentUser({_id: null, avatar: ''})
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    api.updateHeaders()
    setEmail('')
    history.push('/sign-in')
  }

  function registration({email, password}) {
    auth.register(email, password)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          handleInfoTooltipContent({iconPath: registrationOk, text: 'Вы успешно зарегестрировались!'})
          handleInfoTooltipOpen();
          setTimeout(history.push, 3000, '/sign-in');
          setTimeout(closeAllPopups, 2500)
        }
        if (res.status === 400) {
          console.log('Введеный email уже зарегестрирован!')
          handleInfoTooltipContent({
            iconPath: registrationWrong,
            text: 'Введеный email уже зарегестрирован!'
          })
          handleInfoTooltipOpen();
          setTimeout(closeAllPopups, 2500);

        }
      }).catch((err) => {
      handleInfoTooltipContent({iconPath: registrationWrong, text: 'Что-то пошло не так! Попробуйте еще раз!'})
      handleInfoTooltipOpen()
      setTimeout(closeAllPopups, 2500);
      console.log(err)
    })
  }


  function authorization({email, password}) {
    auth.authorize({email, password})
      .then((data) => {
        if (!data) {
          throw new Error('Произошла ошибка')
        }

        auth.getContent(data)
          .then((res) => {
            setEmail(res.data.email);
          })
          .catch(err => console.log(err))
        setLoggedIn(true);
        api.getUserInfo().then((user) => setCurrentUser(user.data)
        )
          .catch((err) => {
            console.log(err)
          });

        handleInfoTooltipContent({iconPath: registrationOk, text: 'Вы успешны авторизованы!'});
        handleInfoTooltipOpen();
        setTimeout(history.push, 3000, '/');
        setTimeout(closeAllPopups, 2500);
      }).catch((err) => {
      handleInfoTooltipContent({iconPath: registrationWrong, text: 'Что-то пошло не так! Попробуйте еще раз!'})
      handleInfoTooltipOpen();
      setTimeout(closeAllPopups, 2500)
      console.log(err)
    })
  }

  return (

    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header loggedIn={loggedIn} email={email} handleSignOut={handleSignOut}/>
          <Switch>
            <Route path="/sign-in">
              <Login
                authorization={authorization}
              />
            </Route>
            <Route path="/sign-up">
              <Register
                registration={registration}
              />
            </Route>
            <ProtectedRoute
              exact path="/" component={Main} onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
              onCardLike={handleCardLike} cards={cards}
              onCardDelete={handleCardDelete} loggedIn={loggedIn}>
              {/*<Main />*/}
            </ProtectedRoute>

            <Route path="/">
              {loggedIn ? <Redirect to="/main"/> : <Redirect to="/sign-in"/>}
            </Route>
          </Switch>
          <Footer/>
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                            onUpdateUser={handleUpdateUser}/>
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                           onUpdateAvatar={handleUpdateAvatar}/>
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
                         onAddPlace={handleAddPlaceSubmit}/>

          <PopupWithForm
            title="Вы уверены?"
            name="remove-card"
            buttonText="Да"
            onClose={closeAllPopups}>
          </PopupWithForm>
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImagePopupOpen}/>
          <InfoTooltip
            isOpen={isTooltipOpen}
            onClose={closeAllPopups}
            message={message}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>

  );
}


export default App;
