import { Link, useNavigate } from "react-router-dom";
import Header from "../Header.jsx";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";
import passed from '../../images/passed.svg'
import failed from '../../images/failed.svg'
import { useEffect, useState } from "react";


function Register ({ onRegister }) {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState ('')

    const [passedPopupOpen, setPassedPopupOpen] = useState(false)
    const [failedPopupOpen, setFailedPopupOpen] = useState(false)


    const navigate = useNavigate();

    function handlePassedPopupOpen() {
        setPassedPopupOpen(true)
  };
    function handleFailedPopupOpen() {
    setFailedPopupOpen(true)
};

  
  function closePopup() {
    setPassedPopupOpen(false)
    setFailedPopupOpen(false)
  }
  
  useEffect(() => {
    const closePopupEsc = e => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };
    if (passedPopupOpen || failedPopupOpen) {
      document.addEventListener('keydown', closePopupEsc);
    }
    return () => {
      document.removeEventListener('keydown', closePopupEsc);
    };
  }, [passedPopupOpen, failedPopupOpen]);


  
  function handleSubmit (e) {
    e.preventDefault()
    onRegister({ email, password })
        .then((res) => {
            console.log(res)
          setEmail("");
          setPassword("");
          handlePassedPopupOpen()
          navigate('/signin')
        //   if (res.status === 400 || res.status === 401) {
        //     handleFailedPopupOpen();
        //   } else {
        //     handlePassedPopupOpen();
        //   }
      }).catch((err) => {
        handleFailedPopupOpen()
        console.log(`Error register ${err}`)
      })
  }

  return (
      <div className="sign">
        <Header 
            link='/signin'
            titleNavigate="Войти"
        />
        <div className="sign__body">
            <h1 className="sign__title">Регистрация</h1>
          <form
            className="sign__form"
            onSubmit={handleSubmit}
          >
            <input
            name="email"
            type="email"
            placeholder="Email"
            id="emailAddress"
            className="sign__input sign__input_type_emailAddress"
            value={email}
            onChange={({target: { value }}) => setEmail(value)}
            minLength='5'
            required
          />
          <span
            className="sign__input-error sign__input-error_type_emailAddress"
            // id="mesto-error"
          />
          <input
            type="password"
            name="password"
            id="pass"
            placeholder="Пароль"
            className="sign__input sign__input_type_pass"
            required
            value={password}
            onChange={({target: { value }}) => setPassword(value)}
          />
          <span
            className="sign__input-error sign__input-error_type_pass"
            // id="url-image-error"
          />
            <button className="sign-up__button-form sign__log-in-button_valid" type="submit">Зарегистрироваться</button>
          </form>

          <p className="sign-up__subtitle">Уже зарегистрированы? <Link to="/signin" className="sign-up__link-navigate">Войти</Link>
            </p>
        </div>
        <InfoTooltip
          linkImage={passed}
          altImage='Попробуй ещё раз'
          subtitle='Вы успешно зарегистрировались!'
          onClose={closePopup}
          isOpen={passedPopupOpen}
        />
        <InfoTooltip
          linkImage={failed}
          altImage='Успешно'
          subtitle='Что-то пошло не так! Попробуйте ещё раз.'
          onClose={closePopup}
          isOpen={failedPopupOpen}
        />
      </div>
    );

}

export default Register