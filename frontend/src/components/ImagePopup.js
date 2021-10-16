import React from "react";

function ImagePopup(props) {

    return (
        <div className={`popup opened-image ${props.card && props.isOpen ? 'popup__opened' : ''}`}>
            <div className="popup__photocontainer">
                <button className="popup__button-close" type="button" onClick={props.onClose}></button>
                <img src={`${props.card.link}`} alt={props.card.name} className="popup__image"/>
                <h2 className="popup__phototitle">{props.card.name} </h2>
            </div>
        </div>
    )
}

export default ImagePopup;