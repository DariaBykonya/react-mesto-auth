// import Header from './Header.jsx'
// import Main from './Main.jsx'
// import Footer from './Footer.jsx'
// import PopupWithForm from './PopupWithForm.jsx'
// import ImagePopup from './ImagePopup.jsx'
// import { useEffect, useState } from 'react'
// import api from '../utils/Api.js'
// import EditProfilePopup from './EditProfilePopup/EditProfilePopup.jsx'
// import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.jsx'
// import AddPlacePopup from './AddPlacePopup/AddPlacePopup'
// import Login from './Login/Login.jsx'
// import Register from './Register/Register.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import Profile from './Profile/Profile.jsx';
import { useState } from 'react';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/Auth.js'; 



function App() {

const [loggedIn, setLoggedIn] = useState(false)

const onRegister = ({ email, password }) => {
 return auth.register(email, password).then((res) => {
    // if (res.statusCode === 400) throw new Error('Некорректно заполнено одно из полей');
    return res
  })
}

const onLogin = ({ email, password }) => {
  return auth.authorize(email, password).then((res) => {
    // if(res.jwt) {
    localStorage.setItem('jwt', res.jwt)
     return res
  })
}

return (
  <BrowserRouter>
    <Routes>
      <Route
        path="*"
        element={<ProtectedRoute element={Profile} loggedIn={loggedIn} />}
      />

      <Route path="/signin" element={<Login onLogin={onLogin} />} />
      <Route path="/signup" element={<Register onRegister={onRegister} />} />
    </Routes>
  </BrowserRouter>
);};


export default App;
