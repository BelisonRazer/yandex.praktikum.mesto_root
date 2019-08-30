"use strict";

import renderLoading from "./common";

export default class Api {
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