"use strict";

import {resetError} from "./validate-form-second";
import {activateError} from "./validate-form-second";
import {isInputLink} from "./validate-form-new";
import FormButtonState from "../blocks/button/button";

const formButtonState = FormButtonState();

const formThird = document.forms.third;
const linkThird = formThird.elements.linkAvatar;

const submitAvatar = document.querySelector('#submit-avatar');
const avaButton = document.querySelector('[name="send-avatar"]');
let isValidFormThird = true;

linkThird.addEventListener('input', handleValidateThird);

function handleValidateThird(evt) {
    resetError(linkThird);
    validateNewThird(linkThird);

    if (!linkThird.classList.contains('err')) {
        formButtonState.active(avaButton);
    }
}

function validateNewThird(element) {
    const errorElement = document.querySelector(`#error-${element.id}`);

    if (!element.checkValidity() || element.value.length === 0) {
        element.classList.add('err');
        errorElement.textContent = "Это бязательное поле";
        activateError(errorElement);
        formButtonState.deactive(avaButton);
        return false;
    } else if (!isInputLink(element)) {
        element.classList.add('err');
        const errorMessage = 'Здесь должна быть ссылка';
        errorElement.textContent = errorMessage;
        activateError(errorElement);
        formButtonState.deactive(avaButton);
        return false;
    }
    return true;
}

export default function sendFormThird(event) {
    const inputs = Array.from(formThird.elements);

    if (inputs[0]) {
        if (!validateNewThird(inputs[0])) isValidFormThird = false;
    }

    if (isValidFormThird) {
        console.log('Good :)) (form-third)');
    } else {
        console.log('bad :(( (form-third)');
    }
}