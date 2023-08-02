export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
        email: email,
        password: password 
    })
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`${res.status}`)
  })
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }).then((res) => {
          return res.json();
    }).then((data) => {
        localStorage.setItem('user', JSON.stringify({ email, password }));
      }); 
  };