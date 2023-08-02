import Header from "../Header.jsx";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";
import failed from '../../images/failed.svg';
import passed from '../../images/passed.svg';
import { useEffect, useState } from "react";


function Login ({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState ('')

  const [passedPopupOpen, setPassedPopupOpen] = useState(false)
  const [failedPopupOpen, setFailedPopupOpen] = useState(false)


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
  // if (!email || !password) {
  //   return
  // }
    onLogin({ email, password })
    .then((res) => {
      console.log(res)
      setEmail('')
      setPassword('')
      if (res.statusCode === 400 || res.statusCode === 401) {
        handleFailedPopupOpen();
      } else {
        handlePassedPopupOpen();
      }
    })
}


  

    return (
      <div className="sign">
        <Header 
            link='/signup'
            titleNavigate="Регистрация"
        />
        <div className="sign__body">
            <h1 className="sign__title">Вход</h1>
          <form
            className="sign__form"
            onSubmit={handleSubmit}
            noValidate
          >

            <input
            type="email"
            name="email"
            placeholder="Email"
            id="emailAddress"
            className="sign__input sign__input_type_emailAddress"
            required=""
            value={email}
            onChange={({target: { value }}) => setEmail(value)}
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
            required=""
            value={password}
            onChange={({target: { value }}) => setPassword(value)}
          />
          <span
            className="sign__input-error sign__input-error_type_pass"
            // id="url-image-error"
          />


            <button className="sign__log-in-button sign__log-in-button_valid" type="submit">Войти</button>
          </form>
        </div>
        <InfoTooltip
          linkImage={failed}
          altImage='Успешно'
          subtitle='Что-то пошло не так! Попробуйте ещё раз.'
          onClose={closePopup}
          isOpen={failedPopupOpen}
        />
                <InfoTooltip
          linkImage={passed}
          altImage='Попробуй ещё раз'
          subtitle='Вы успешно зарегистрировались!'
          onClose={closePopup}
          isOpen={passedPopupOpen}
        />
      </div>
      
    );

}

export default Login