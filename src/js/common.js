
export default function renderLoading(isLoading) {
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