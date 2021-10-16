import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isOpen, onClose, onAddPlace}) {

    const [name, setName] = React.useState('')
    const [link, setLink] = React.useState('')

    function handleSubmit(evt) {
        evt.preventDefault()
        onAddPlace({
            name: name,
            link: link,
        })
    }

    function handleChangeName(evt) {
        setName(evt.target.value)
    }

    function handleChangeLink(evt) {
        setLink(evt.target.value)
    }

    return (
        <PopupWithForm
            title="Новое место"
            name="photo"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}>
            <input type="text" className="popup__field " id="form-title-input" name="name"
                   value={name || ''}
                   placeholder="Название"
                   required
                   minLength="2" maxLength="30" onChange={handleChangeName}/>
            <span className="form-title-input-error"> </span>
            <input type="url" className="popup__field popup__field_link" id="form-link-input" name="link"
                   value={link || ''}
                   placeholder="Ссылка на картинку" required onChange={handleChangeLink}/>
            <span className="form-link-input-error"> </span>
        </PopupWithForm>
    )
}

export default AddPlacePopup;