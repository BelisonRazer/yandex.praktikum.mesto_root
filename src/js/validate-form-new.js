"use strict";

import {resetError} from "./validate-form-second";
import {activateError} from "./validate-form-second";
import {isInputLength} from "./validate-form-second";
import FormButtonState from "../blocks/button/button";

const formButtonState = FormButtonState();

const form = document.forms.new;
const name = form.elements.name;
const link = form.elements.link;

const addButton = document.querySelector('[name="addPopup"]');
const submitAdd = document.querySelector('#submit-add');
let isValidFormNew = true;

name.addEventListener('input', handleValidate);
link.addEventListener('input', handleValidateTwo);

function handleValidate(evt) {
    resetError(name);
    validateNew(name);

    if (!name.classList.contains('err') && !link.classList.contains('err')) {
        formButtonState.active(addButton);
    }
}

function handleValidateTwo(evt) {
    resetError(link);
    validateNewTwo(link);

    if (!name.classList.contains('err') && !link.classList.contains('err')) {
        formButtonState.active(addButton);
    }
}

function validateNew(element) {
    const errorElement = document.querySelector(`#error-${element.id}`);

    if (!element.checkValidity() || element.value.length === 0) {
        element.classList.add('err');
        errorElement.textContent = "Это бязательное поле";
        activateError(errorElement);
        formButtonState.deactive(addButton);
        return false;
    } else if (!isInputLength(element)) {
        element.classList.add('err');
        const errorMessage = 'Должно быть от 2 до 30 символов';
        errorElement.textContent = errorMessage;
        activateError(errorElement);
        formButtonState.deactive(addButton);
        return false;
    }
    return true;
}

function validateNewTwo(element) {
    const errorElement = document.querySelector(`#error-${element.id}`);

    if (!element.checkValidity() || element.value.length === 0) {
        element.classList.add('err');
        errorElement.textContent = "Это бязательное поле";
        activateError(errorElement);
        formButtonState.deactive(addButton);
        return false;
    } else if (!isInputLink(element)) {
        element.classList.add('err');
        const errorMessage = 'Здесь должна быть ссылка';
        errorElement.textContent = errorMessage;
        activateError(errorElement);
        formButtonState.deactive(addButton);
        return false;
    }
    return true;
}

export function isInputLink(element) {
    const reg = /(?:http[s]?\/\/)?(?:[\w\-]+(?::[\w\-]+)?@)?(?:[\w\-]+\.)+(?:[a-z]{2,4})(?::[0-9]+)?(?:\/[\w\-\.%]+)*(?:\?(?:[\w\-\.%]+=[\w\-\.%!]+&?)+)?(#\w+\-\.%!)?/;

    if (reg.test(element.value)) {
        return true;
    }
    return false;
}

export default function sendFormNew(event) {
    const inputs = Array.from(form.elements);

    if (inputs[0]) {
        if (!validateNew(inputs[0])) isValidFormNew = false;
    }

    if (inputs[1]) {
        if (!validateNewTwo(inputs[1])) isValidFormNew = false;
    }

    if (isValidFormNew) {
        console.log('Good :)) (form-new)');
    } else {
        console.log('bad :(( (form-new)');
    }
}