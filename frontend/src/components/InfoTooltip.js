import React from 'react';


function InfoTooltip({onClose, isOpen, message}) {
    return (
        <div className={`popup popup_type_infotool ${isOpen ? 'popup__opened' : ''}`}>
            <div className="popup__container">
                <img src={message.iconPath} alt="Картинка Yes или No" className="popup__result-icon"/>
                <p className="popup__title-info">{message.text}</p>
                <button type="button" className="popup__button-close" onClick={onClose}/>
            </div>
        </div>
    );
}

export default InfoTooltip;