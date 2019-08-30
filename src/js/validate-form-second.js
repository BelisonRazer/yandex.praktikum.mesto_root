"use strict";

import FormButtonState from "../blocks/button/button";

const formButtonState = FormButtonState();

const formSecond = document.forms.second;
const yourName = formSecond.elements.yourName;
const aboutYou = formSecond.elements.aboutYou;

const saveButton = document.querySelector('[name="savePopup"]');
const submitEdit = document.querySelector('#submit');
let isValidForm = true;

yourName.addEventListener('input', handleValidate);
aboutYou.addEventListener('input', handleValidate);

function handleValidate(evt) {
    resetError(evt.target);
    validate(evt.target);

    if (!yourName.classList.contains('err') && !aboutYou.classList.contains('err')) {
        formButtonState.active(saveButton);
    }
}

function validate(element) {
    const errorElement = document.querySelector(`#error-${element.id}`);

    if (!element.checkValidity()) {
        element.classList.add('err');
        errorElement.textContent = "Это бязательное поле";
        activateError(errorElement);
        formButtonState.deactive(saveButton);
        return false;
    } else if (!isInputLength(element)) {
        element.classList.add('err');
        const errorMessage = 'Должно быть от 2 до 30 символов';
        errorElement.textContent = errorMessage;
        activateError(errorElement);
        formButtonState.deactive(saveButton);
        return false;
    }
    return true;
}

export function isInputLength(element) {
    if (element.value.length >= 2 && element.value.length <= 30) {
        resetError(element);
        return true;
    }
    return false;
}

export function activateError(element) {
    element.parentNode.classList.add('popup__input-container-invalid');
}

export function resetError(element) {
    const errorElement = document.querySelector(`#error-${element.id}`);

    element.parentNode.classList.remove('popup__input-container-invalid');
    errorElement.textContent = '';
    element.classList.remove('err');
}

export default function sendForm(event) {
    const inputs = Array.from(formSecond.elements);

    inputs.forEach((elem) => {
        if (elem.id !== submitEdit.id) {
            if (!validate(elem)) isValidForm = false;
        }
    });

    if (isValidForm) {
        console.log('Good :)) (form-second)');
    } else {
        console.log('bad :(( (form-second)');
    }
}