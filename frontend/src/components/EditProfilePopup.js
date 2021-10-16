import React from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
    const currentUser = React.useContext(CurrentUserContext);

    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')

    function handleChangeName(evt) {
        setName(evt.target.value);
    }

    function handleChangeDescription(evt) {
        setDescription(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onUpdateUser({
            name: name,
            about: description,
        });
    }

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen])

    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="profile"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}>
            <input id="form-name-input" type="text" className="popup__field popup__field_name" name="name"
                   value={name || ""}
                   placeholder="Имя" required minLength="2" maxLength="40"
                   onChange={handleChangeName}/>
            <span className="form-name-input-error"></span>
            <input id="form-profession-input" type="text" className="popup__field popup__field_profession"
                   name="about"
                   value={description || ""}
                   placeholder="Профессия" required minLength="2" maxLength="200"
                   onChange={handleChangeDescription}/>
            <span className="form-profession-input-error"></span>
        </PopupWithForm>
    )
}

export default EditProfilePopup