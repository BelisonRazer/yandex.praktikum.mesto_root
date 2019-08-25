"use strict";

const placesList = document.querySelector('.places-list');
const popupAddBtn = document.querySelector('[name="add"]');
const popupEditProfileBtn = document.querySelector('[name="edit"]');
const popupCloseBtnAdd = document.querySelector('.popup__close-add');
const popupCloseBtnEdit = document.querySelector('.popup__close-edit');
const popupCloseBtnImg = document.querySelector('.popup__close-img');
const popupCloseBtnAva = document.querySelector('.popup__close-avatar');
const addButton = document.querySelector('[name="addPopup"]');
const saveButton = document.querySelector('[name="savePopup"]');
const avaButton = document.querySelector('[name="send-avatar"]');
const userInfoPhoto = document.querySelector('.user-info__photo');

const formNew = document.forms.new;
const nameNew = formNew.elements.name;
const linkNew = formNew.elements.link;

const formThird = document.forms.third;
const linkThird = formThird.elements.linkAvatar;

const popupAddElement = document.querySelector('.popup-addCard');
const popupEditProfile = document.querySelector('.popup-editProfile');
const popupImage = document.querySelector('.popup-image');
const popupAvatar = document.querySelector('.popup-avatar');

const formButtonState = FormButtonState();
const myUserId = '6177f212135696b6727e1128';

class Card {
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

class CardList {
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

class Popup {
    constructor(popup) {
        this.popup = popup;
    }

    open() {
        this.popup.classList.add('popup_is-opened');
    }

    close() {
        this.popup.classList.remove('popup_is-opened');
    }
}

const cardList = new CardList(placesList, '');
const popupAdd = new Popup(popupAddElement);
const popupEdit = new Popup(popupEditProfile);
const popupImg = new Popup(popupImage);
const popupAva = new Popup(popupAvatar);

class EditProfilePopup extends Popup {
    constructor(popup) {
        super(popup);
    }

    open() {
        super.open();

        const userInfoName = document.querySelector('.user-info__name');
        const userInfoData = document.querySelector('.user-info__job');
        formButtonState.active(saveButton);
        document.querySelector('.popup__input_type-yourName').value = userInfoName.innerText;
        document.querySelector('.popup__input_type-aboutYou').value = userInfoData.innerText;
    }

    handleSaveClick(e) {
        e.preventDefault();
        sendForm();
        const form = document.forms.second;
        const yourName = form.elements.yourName;
        const aboutYou = form.elements.aboutYou;
        const userInfoName = document.querySelector('.user-info__name');
        const userInfoData = document.querySelector('.user-info__job');

        userEdit.patchUserProfile(yourName.value, aboutYou.value).then((result) => {
            userInfoName.textContent = result.name;
            userInfoData.textContent = result.about;
        }).catch((err) => {
            console.log(err);
        }).finally(_ => {
            renderLoading(false);
        })

        super.close();
    }
}

class PopupAddCard extends Popup {
    constructor(popup) {
        super(popup);
    }

    open() {
        super.open();
        formButtonState.deactive(addButton);
    }

    handleAddClick(e) {
        e.preventDefault();
        sendFormNew();

        api.sendCard(name.value, link.value).then((result) => {
            cardList.addCard(result.name, result.link, result.likes.length, result.owner._id, result._id);
        }).catch((err) => {
            console.log(err);
        }).finally(_ => {
            renderLoading(false);
        })

        formNew.reset();
        nameNew.classList.add('err');
        linkNew.classList.add('err');
        super.close();
    }
}

class PopupImage extends Popup {
    constructor(popup) {
        super(popup);
    }

    open(e) {
        if (e.target.classList.contains('place-card__image')) {
            super.open();

            const image = event.target.style.backgroundImage;
            const imgBox = document.querySelector('.popup__image-box');
            const img = document.createElement('img');

            const reg = new RegExp(/\url\(\"/);
            const regTwo = new RegExp(/(\)$)/);
            const regThree = new RegExp(/(\"$)/);

            let regular = image.replace(reg, '');
            regular = regular.replace(regTwo, '');
            regular = regular.replace(regThree, '');

            imgBox.appendChild(img);
            img.classList.add('popup__image');
            img.setAttribute("src", regular);
        }
    }

    handleDeleteClick() {
        const image = document.querySelector('.popup__image');
        const imgBox = document.querySelector('.popup__image-box');

        if (image) {
            imgBox.removeChild(image);
        }

        super.close();
    }
}

class PopupAvatar extends Popup {
    constructor(popup) {
        super(popup);
    }

    open() {
        super.open();
        formButtonState.deactive(avaButton);
    }

    handleSendClick(e) {
        e.preventDefault();
        sendFormThird();

        api.changeAvatar(linkThird.value).then((user) => {
            userInfoPhoto.style.backgroundImage = `url('${user.avatar}')`;
        }).catch((err) => {
            console.log(err);
        });

        formThird.reset();
        linkThird.classList.add('err');
        super.close();
    }
}

const editProfilePopup = new EditProfilePopup(popupEditProfile);
const popupAddCard = new PopupAddCard(popupAddElement);
const popupImages = new PopupImage(popupImage);
const popupAvatars = new PopupAvatar(popupAvatar);

function FormButtonState() {
    function active(btn) {
        btn.removeAttribute('disabled');
        btn.style.cursor = 'pointer';
        btn.style.background = "#000000";
        btn.style.color = '#ffffff';
        btn.style.opacity = "1";
    }

    function deactive(btn) {
        btn.setAttribute('disabled', true);
        btn.style.cursor = 'default';
        btn.style.background = "#FFFFFF";
        btn.style.color = '#000000';
        btn.style.opacity = "0.2";
    }

    return {
        active,
        deactive
    };
}

popupAddBtn.addEventListener('click', (elem) => popupAddCard.open(elem));
popupCloseBtnAdd.addEventListener('click', (elem) => popupAdd.close(elem));
formNew.addEventListener('submit', (elem) => popupAddCard.handleAddClick(elem));

popupEditProfileBtn.addEventListener('click', (elem) => editProfilePopup.open(elem));
popupCloseBtnEdit.addEventListener('click', (elem) => popupEdit.close(elem));
document.forms.second.addEventListener('submit', (elem) => editProfilePopup.handleSaveClick(elem));

popupCloseBtnImg.addEventListener('click', (elem) => popupImages.handleDeleteClick(elem));
placesList.addEventListener('click', (elem) => popupImages.open(elem));

userInfoPhoto.addEventListener('click', (elem) => popupAvatars.open(elem));
popupCloseBtnAva.addEventListener('click', (elem) => popupAva.close(elem));
formThird.addEventListener('submit', (elem) => popupAvatars.handleSendClick(elem));

//https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60