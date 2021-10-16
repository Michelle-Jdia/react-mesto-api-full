import React from "react";

function PopupWithForm(props) {
    return (
        <div className={`popup popup_type_${props.name} ${props.isOpen && 'popup__opened'}`}>
            <div className="popup__container">
                <button className="popup__button-close" type="button" onClick={props.onClose}></button>
                <h2 className="popup__heading">{props.title}</h2>
                <form className={`popup__input form_type_${props.name}`} name={`${props.name}_form`}  onSubmit={props.handleSubmit}>
                    {props.children}
                    <button className="popup__button-save" type="submit" >
                        {props.buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
}


export default PopupWithForm;