import Api from "../../js/api";
import renderLoading from "../../js/common";

const userInfoPhoto = document.querySelector('.user-info__photo');

export default class UserEdit extends Api {
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
let url;

if (NODE_ENV === 'production') {
	url = 'https://praktikum.tk/cohort1'; 
} else {
	url = 'https://praktikum.tk/cohort1';
}

const api = new Api({
    baseUrl: url,
    headers: {
        authorization: '5827babf-da13-436e-bf42-aaef7271e4d6',
        'Content-Type': 'application/json'
    }
});

api.getUserProfile().then((user) => {
    document.querySelector('.user-info__name').textContent = user.name;
    document.querySelector('.user-info__job').textContent = user.about;
    userInfoPhoto.style.backgroundImage = `url('${user.avatar}')`;
}).catch((err) => {
    console.log(err);
});