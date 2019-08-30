import {CardList} from "../place-card/place-card";
import FormButtonState from "../button/button";
import renderLoading from "../../js/common";
import Api from "../../js/api";

import sendForm from "../../js/validate-form-second";
import sendFormNew from "../../js/validate-form-new";
import sendFormThird from "../../js/validate-form-avatar";
import UserEdit from "../user-info/user-info";

let url;

if (NODE_ENV === 'production') {
	url = 'https://praktikum.tk/cohort1';
} else {
	url = 'http://praktikum.tk/cohort1';
}

const api = new Api({
    baseUrl: url,
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});

const userEdit = new UserEdit({
    baseUrl: url,
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});

const formButtonState = FormButtonState();

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

        api.sendCard(nameNew.value, linkNew.value).then((result) => {
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
