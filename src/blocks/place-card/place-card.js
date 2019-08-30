"use strict";

import Api from "../../js/api";

let url;

if (NODE_ENV === 'production') {
	url = 'https://praktikum.tk/cohort1'; 
} else {
	url = 'https://praktikum.tk/cohort1';
}

const api = new Api({
    baseUrl:  url,
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});

const placesList = document.querySelector('.places-list');
export const myUserId = '6177f212135696b6727e1128';

export default class Card {
    constructor(name, url, likes, myId, cardId) {
        this.cardElement = this.create(name, url, likes, myId, cardId);
        this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
        this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    }

    async like(evt) {
        const id = evt.target.getAttribute('myid');
        evt.target.classList.toggle('place-card__like-icon_liked');

        try {
            let newCardData;
            if(evt.target.classList.contains('place-card__like-icon_liked')) {
                newCardData = await api.likeCard(id);
            } else {
                newCardData = await api.dislikeCard(id);
            }

            evt.target.closest('.place-card').querySelector('.place-card__like-value').textContent = newCardData.likes.length;
        } catch(err) {
            console.log(err);
        }
    }

    remove(evt) {
        const card = evt.target.closest('.place-card');
        const id = evt.target.getAttribute('myid');

        if (window.confirm("Вы действительно хотите удалить эту карточку?")) {
            api.deleteCard(id).then(_ => {
                card.parentNode.removeChild(card);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    create(nameValue, urlValue, likesValue, idMe, idCard) {
        if ('content' in document.createElement('template')) {
            const templ = document.querySelector('.template');
            const cardPlaceImg = templ.content.querySelector('.place-card__image');
            const cardName = templ.content.querySelector('.place-card__name');
            const likes = templ.content.querySelector('.place-card__like-value');
            const deleteIcon = templ.content.querySelector('.place-card__delete-icon');
            const likeIcon = templ.content.querySelector('.place-card__like-icon');
            const placeCards = templ.content.querySelector('.place-card');

            if(idMe === myUserId) {
                deleteIcon.classList.add('place-card__delete-icon_show');
            }

            if(idMe !== myUserId) {
                deleteIcon.classList.remove('place-card__delete-icon_show');
            }

            placeCards.setAttribute('myid', idCard);
            likeIcon.setAttribute('myid', idCard);
            deleteIcon.setAttribute('myid', idCard);
            cardPlaceImg.style.backgroundImage = `url(${urlValue})`;
            cardName.textContent = nameValue;
            likes.textContent = likesValue;

            const container = document.importNode(templ.content, true);
            return container;
        } else {
            console.log('тег <template> не поддерживается браузером');

            const container = document.createDocumentFragment();
            const placeCard = document.createElement('div');
            const placeCardImage = document.createElement('div');
            const placeCardBtnDel = document.createElement('button');
            const placeCardDescription = document.createElement('div');
            const placeCardName = document.createElement('h3');
            const placeCardLikeGroup = document.createElement('div');
            const placeCardLikeValue = document.createElement('p');
            const placeCardBtnLike = document.createElement('button');

            placeCardImage.appendChild(placeCardBtnDel);
            placeCardDescription.appendChild(placeCardName);
            placeCardDescription.appendChild(placeCardLikeGroup);
            placeCardLikeGroup.appendChild(placeCardBtnLike);
            placeCardLikeGroup.appendChild(placeCardLikeValue);
            placeCard.appendChild(placeCardImage);
            placeCard.appendChild(placeCardDescription);
            container.appendChild(placeCard);

            placeCard.classList.add('place-card');
            placeCardImage.classList.add('place-card__image');
            placeCardBtnDel.classList.add('place-card__delete-icon');
            placeCardDescription.classList.add('place-card__description');
            placeCardName.classList.add('place-card__name');
            placeCardLikeGroup.classList.add('place-card__like-group');
            placeCardLikeValue.classList.add('place-card__like-value');
            placeCardBtnLike.classList.add('place-card__like-icon');
            placeCardImage.style.backgroundImage = `url(${urlValue})`;
            placeCardName.textContent = nameValue;
            placeCardLikeValue.textContent = likesValue;

            if(idMe == myUserId) {
                placeCardBtnDel.classList.add('place-card__delete-icon_show');
            }

            return container;
        }
    }
}

export class CardList {
    constructor(container, serverCards) {
        this.container = container;
        this.serverCards = serverCards;
        this.render();
    }

    addCard(name, url, likes, myId, cardId) {
        const {
            cardElement
        } = new Card(name, url, likes, myId, cardId);
        this.container.appendChild(cardElement);
    }

    render() {
        if (placesList.getElementsByClassName('place-card').length === 0) {
            for (let i = 0; i < this.serverCards.length; i++) {
                this.addCard(this.serverCards[i].name, 
                    this.serverCards[i].link, 
                    this.serverCards[i].likes.length, 
                    this.serverCards[i].owner._id, 
                    this.serverCards[i]._id);
            }
        }
    }
}

//https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60