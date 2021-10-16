import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDelete}) {

    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = card.owner === currentUser._id;

    const cardDeleteButtonClassName = (
        `elements__button-delete ${isOwn ? 'elements__button-delete' : 'elements__button-delete_hidden'}`
    );

    const isLiked = card.likes.some(item => item === currentUser._id);
    const cardLikeButtonClassName =
        `elements__button-like ${isLiked ? 'elements__button-like-active' : ''}`;


    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card)
    }

    function handleCardDelete() {
        onCardDelete(card)
    }

    return (
        <div className="elements-template">
            <div className="elements__item card">
                <img src={card.link} alt={card.name} className="elements__photo" onClick={handleClick}
                />
                <button className={cardDeleteButtonClassName} type="button" onClick={handleCardDelete}></button>
                <h3 className="elements__paragraph">{card.name}</h3>
                <div className="elements__button-like-container">
                    <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                    <p className="elements__button-like-counter">{card.likes.length}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;