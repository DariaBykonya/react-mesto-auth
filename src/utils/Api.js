class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this._headers = options.headers;
    this._authorization = options.headers.authorization;
  }

  _checkQuery(res) {
    return res.ok ? res.json() : Promise.reject;
  }

  getInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: this._authorization
      }
    }).then(this._checkQuery);
  }
  getCards() {
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: this._authorization
      }
    }).then(this._checkQuery);
  }
  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.nameuser,
        about: data.profession
      })
    }).then(this._checkQuery);
  }

  patchAddAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    }).then(this._checkQuery);
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.title,
        link: data.image
      })
    }).then(this._checkQuery);
  }

  addLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this._authorization
      }
    }).then(this._checkQuery);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization
      }
    }).then(this._checkQuery);
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this.deleteLike(id);
    } else {
      return this.addLike(id);
    }
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization
      }
    }).then(this._checkQuery);
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-66',
  headers: {
    authorization: 'ae8e820c-7030-4549-b668-34fdff5dfa8b',
    'Content-Type': 'application/json'
  }
});

export default api;