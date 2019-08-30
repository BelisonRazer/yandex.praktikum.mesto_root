import Api from "../../js/api";
import {myUserId} from "./place-card";
import {CardList} from "../place-card/place-card";

const placesList = document.querySelector('.places-list');

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

//likes
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