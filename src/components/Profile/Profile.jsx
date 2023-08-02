import Header from '../Header.jsx'
import Main from '../Main.jsx'
import Footer from '../Footer.jsx'
import PopupWithForm from '../PopupWithForm'
import ImagePopup from '../ImagePopup.jsx'
// import currentUserContext from '../../contexts/CurrentUserContext.js'
import api from '../../utils/Api.js'
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup'
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup.jsx'
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup'
import { useEffect, useState } from 'react'
import currentUserContext from '../../contexts/CurrentUserContext.js';




function Profile () {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
};

const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  function handleEditProfileClick() {
  setIsEditProfilePopupOpen(true)
};


const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
function handleAddPlaceClick() {

  setIsAddPlacePopupOpen(true)
};



// стейты для крточек
const [selectedCard, setSelectedCard] = useState(null)
const [isImagePopupOpen, setImagePopupOpen] = useState(false)

const [deleteCardId, setDeleteCardId] = useState('')


const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false)
function handleDeleteCardClick(cardId) {
  setDeleteCardId(cardId)
  setIsConfirmDeletePopupOpen(true)
};

// Валидация форм

// закрытие попапа по нажатию esc
useEffect(() => {
  const closePopupEsc = e => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  };
  if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isImagePopupOpen || isConfirmDeletePopupOpen) {
    document.addEventListener('keydown', closePopupEsc);
  }
  return () => {
    document.removeEventListener('keydown', closePopupEsc);
  };
}, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isImagePopupOpen, isConfirmDeletePopupOpen]);


function handleCardClick(card) {
setSelectedCard(card)
setImagePopupOpen(true)
}


function closeAllPopups() {
  setIsEditAvatarPopupOpen(false)
  setIsEditProfilePopupOpen(false)
  setIsAddPlacePopupOpen(false)
  setImagePopupOpen(false)
  setIsConfirmDeletePopupOpen(false)
}


const [currentUser, setCurrentUser] = useState({})

// загрузка карточек на странице
const [cards, setCards] = useState([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  setIsLoading(true)
  Promise.all([api.getInfo(), api.getCards()])
  .then(([dataUser, dataCards]) => {
    setCurrentUser(dataUser)
    setCards(dataCards)
    setIsLoading(false)
  })
  .catch(error => console.error(`Ошибка ${error}`))
}, [])

function handleUpdateUser(data) {
  api.patchUserInfo(data)
    .then(
      (data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
    .catch(error => console.error(`Ошибка ${error}`))
}

function handleUpdateAvatar(data) {
  api.patchAddAvatar(data)
  .then(
    (data) => {
      setCurrentUser(data)
      closeAllPopups()
    })
  .catch(error => console.error(`Ошибка ${error}`))
}

function handleAddPlaceSubmit(data) {
  api.addCard(data)
  .then(
    (newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups()
    })
    .catch(error => console.error(`Ошибка ${error}`))
}

function handleCardDelete(evt) {
 evt.preventDefault()
 api.deleteCard(deleteCardId)
 .then (() => {
  api.getCards()
  .then((dataCards) => {
    setCards(dataCards)
    closeAllPopups()
  })
})
 .catch(error => console.error(`Ошибка ${error}`))
}

function handleCardLike(card) {
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  api.changeLikeCardStatus(card._id, isLiked)
    .then(
      (newCard) => {
        const newCards = cards.map((currentCard) => currentCard._id === card._id ? newCard : currentCard)
        setCards(newCards);
      })
      .catch(error => console.error(`Ошибка ${error}`))

    }


    return (
        <currentUserContext.Provider value={currentUser}>
        <div>
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onDelete={handleDeleteCardClick}
          cards={cards}
          isLoading={isLoading}
          onCardLike={handleCardLike}
        />
        <Footer />

        <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup 
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        />        

        <PopupWithForm
          title="Вы уверены?"
          name="confirm"
          titleButton="Да"
          isOpen={isConfirmDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
        ></PopupWithForm>
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
      </div>
      </currentUserContext.Provider>

    );
};

export default Profile