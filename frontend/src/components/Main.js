import plusButton from '../images/plusButton.svg'

import React from "react";
import Card from "./Card";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main(props) {

    const {onEditAvatar, onAddPlace, onEditProfile, onCardClick, onCardLike, onCardDelete, cards} = props;

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="main">
            <section className="profile">
                <div className="profile__avatar-container">
                    <img src={currentUser.avatar} alt="Фото Аватара" className="profile__avatar"/>
                    <button className="profile__avatar-edit" type="button" onClick={onEditAvatar}> </button>
                </div>
                <div className="profile__info">
                    <div className="profile__edit">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__button-edit" type="button"
                                onClick={onEditProfile}> </button>
                    </div>
                    <p className="profile__profession">{currentUser.about}</p>
                </div>
                <button className="profile__button-add" type="button" onClick={onAddPlace}>
                    <img src={plusButton} alt="Значок плюса"/>
                </button>
            </section>
            <section className="elements">
                {cards.map((card) =>
                  (<Card key={card._id} card={card} onCardClick={onCardClick}
                                          onCardLike={onCardLike} onCardDelete={onCardDelete}/>))}
            </section>
        </main>
    )
}


export default Main;