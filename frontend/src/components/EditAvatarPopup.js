import React from "react";
import PopupWithForm from "./PopupWithForm";
// import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

    //const currentUser = React.useContext(CurrentUserContext);
    const avatarInput = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();
        onUpdateAvatar({
            avatar: avatarInput.current.value,
        })
    }

    // React.useEffect(()=> {
    //     avatarInput.current.value = currentUser.avatar;
    // }, [''])

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="avatar"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}>
            <input type="url" className="popup__field popup__avatar-link" id="form-avatar-input" name="link"
                   placeholder="Ссылка на аватар" ref={avatarInput} required/>
            <span className="form-avatar-input-error"> </span>
        </PopupWithForm>
    )
};

export default EditAvatarPopup;