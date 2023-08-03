import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import ProtectedRoute from './ProtectedRoute.js';
import { register, authorize, getContent } from '../utils/Auth.js';
import Header from '../components/Header.jsx'
import Main from '../components/Main.jsx'
import PopupWithForm from '../components/PopupWithForm.jsx'
import ImagePopup from '../components/ImagePopup.jsx'
import api from '../utils/Api.js'
import EditProfilePopup from './EditProfilePopup/EditProfilePopup.jsx'
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.jsx'
import AddPlacePopup from './AddPlacePopup/AddPlacePopup'
import { useEffect, useState } from 'react'
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import InfoTooltip from './InfoTooltip/InfoTooltip.jsx';



function App() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('');
  const handleLoggedIn = () => {
    setLoggedIn(true);
  };
  const [isInfoTooltipSucceed, setIsInfoTooltipSucceed] = useState({
    isOpen: false,
    isSucceed: false,
  });

  const checkAuth = (token) => {
    getContent(token)
      .then((data) => {
        if (data.data) {
          setUserEmail(data.data.email);
          handleLoggedIn();
          navigate('/');
        }
      })
      .catch((err) => console.log(`Пользователь не авторизован ${err}`));
  };

  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkAuth(jwt);
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    tokenCheck();
  }, []);

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
    setIsInfoTooltipSucceed({
      ...isInfoTooltipSucceed,
      isOpen: false,
    });
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




    const handleRegister = (password, email) => {
      register(password, email)
        .then((res) => {
          if (res) {
            navigate("/signin");
            setIsInfoTooltipSucceed({
              isOpen: true,
              isSucceed: true,
            });
          }
        })
        .catch((err) => {
          console.log(`Ошибка регистрации ${err}`);
          setIsInfoTooltipSucceed({
            isOpen: true,
            isSucceed: false,
          });
        });
    };

    const handleLogin = (password, email) => {
      authorize(password, email)
        .then((res) => {
          if (res) {
            localStorage.setItem("jwt", res.token);
            checkAuth(res.token);
          }
          console.log(localStorage.getItem("jwt"))
        })
        .catch((err) => {
          console.log(`Ошибка авторизации ${err}`);
          setIsInfoTooltipSucceed({
            isOpen: true,
            isSucceed: false,
          });
        });
    };


    const signOut = () => {
      localStorage.removeItem("jwt");
      setUserEmail("");
      setLoggedIn(false);
    };

   useEffect(() => {
      if (loggedIn) {
        api
          .getInfo()
          .then((data) => {
            setCurrentUser(data);
          })
          .catch((err) => {
            console.log(`Данные пользователя не загрузились: ${err}`);
          });
  
        api
          .getCards()
          .then((data) => {
            setCards(data);
          })
          .catch((err) => {
            console.log(`Карточки не загрузились: ${err}`);
          });
      }
    }, [loggedIn]);

      // закрытие попапа по нажатию esc
  useEffect(() => {
    const closePopupEsc = e => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isImagePopupOpen || isConfirmDeletePopupOpen || isInfoTooltipSucceed) {
      document.addEventListener('keydown', closePopupEsc);
    }
    return () => {
      document.removeEventListener('keydown', closePopupEsc);
    };
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isImagePopupOpen, isConfirmDeletePopupOpen, isInfoTooltipSucceed]);


  return (
    <CurrentUserContext.Provider value={currentUser}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                    <Header loggedIn={loggedIn} email={userEmail} onSignOut={signOut} />
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
                </ProtectedRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <>
                  <Header>
                    <Link className="header__navigate-title" to="/signup">
                      Регистрация
                    </Link>
                  </Header>
                  <Login onLogin={handleLogin} />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Header>
                    <Link className="header__navigate-title" to="/signin">
                      Войти
                    </Link>
                  </Header>
                  <Register onRegister={handleRegister} />
                </>
              }
            />
          </Routes>

        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoTooltipSucceed.isOpen}
          isSucceed={isInfoTooltipSucceed.isSucceed}
        />

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
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
    </CurrentUserContext.Provider>
    );
  }

export default App;
