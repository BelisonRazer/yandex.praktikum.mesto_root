"use strict";

class Api {
    constructor(options) {
        this.options = options;
    }
    
    async getInitialCards() {
        const res = await fetch(`${this.options.baseUrl}/cards`, {
            headers: {
                authorization: this.options.headers.authorization
            }
        });

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`);
        }
    }
    
    async getUserProfile() {
        const res = await fetch(`${this.options.baseUrl}/users/me`, {
            headers: {
                authorization: this.options.headers.authorization
            }
        })

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`);
        }
    }
    
    async sendCard(name, link) {
        renderLoading(true);

        const res = await fetch(`${this.options.baseUrl}/cards`, {
            method: 'POST',
            headers: {
                authorization: this.options.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${name}`,
                link: `${link}`
            })
        })

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`)
        }
    }
    
    async deleteCard(idCard) {
        const res = await fetch(`${this.options.baseUrl}/cards/${idCard}`, {
            method: 'DELETE',
            headers: {
                authorization: this.options.headers.authorization,
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`)
        }
    }
    
    async likeCard(idCard) {
        return await fetch(`${this.options.baseUrl}/cards/like/${idCard}`, {
                method: 'PUT',
                headers: {
                    authorization: this.options.headers.authorization,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                return result;
            })
    }
    
    async dislikeCard(idCard) {
        return await fetch(`${this.options.baseUrl}/cards/like/${idCard}`, {
            method: 'DELETE',
            headers: {
                authorization: this.options.headers.authorization,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            }

            return Promise.reject(`Ошибка: ${res.status}`);
        }).then((result) => {
            return result;
        })
    }
    
    async changeAvatar(url) {
        const res = await fetch(`${this.options.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: this.options.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: `${url}`
            })
        })

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`)
        }
    }
}


class UserEdit extends Api {
    constructor(options) {
        super(options);
    }

    async patchUserProfile(name, about) {
        renderLoading(true);

        const res = await fetch(`${this.options.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this.options.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${name}`,
                about: `${about}`
            })
        })

        if (res.ok) {
            const json = await res.json();
            return json;
        } else {
            throw new Error(`Ошибка: ${res.status}`)
        }
    }
}

function renderLoading(isLoading) {
    const element = document.getElementById('submit');
    const elementTwo = document.getElementById('submit-add');

    if (isLoading) {
        element.firstChild.data = 'Загрузка';
        elementTwo.firstChild.data = 'Загрузка';
    } else {
        element.firstChild.data = 'Сохранить';
        elementTwo.firstChild.data = 'Сохранить';
    }
}

const api = new Api({
    baseUrl: 'http://95.216.175.5/cohort1',
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});
const userEdit = new UserEdit({
    baseUrl: 'http://95.216.175.5/cohort1',
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});


api.getInitialCards().then((list) => {
    new CardList(placesList, list);

    list.forEach((item) => {
        const isHasSelfLike = item.likes.some((like) => like._id === myUserId);
    
        if (isHasSelfLike) {
            document.querySelector(`[myid='${item._id}']`).querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
        }
    })

}).catch((err) => {
    console.log(err);
});

api.getUserProfile().then((user) => {
    document.querySelector('.user-info__name').textContent = user.name;
    document.querySelector('.user-info__job').textContent = user.about;
    userInfoPhoto.style.backgroundImage = `url('${user.avatar}')`;
}).catch((err) => {
    console.log(err);
});
// (() => {})();