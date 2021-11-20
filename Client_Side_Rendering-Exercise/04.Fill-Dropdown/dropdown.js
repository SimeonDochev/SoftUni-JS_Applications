import { html, render } from '../../node_modules/lit-html/lit-html.js';

const dropDownTemplate = (items) => html`
<select id="menu">
    ${items.map(item => html`<option .value=${item._id}>${item.text}</option>`)}
</select>`;

const url = 'http://localhost:3030/jsonstore/advanced/dropdown';
const main = document.querySelector('div');
const input = document.getElementById('itemText');
document.querySelector('form').addEventListener('submit', onSubmit);

renderItems();

async function onSubmit(event) {
    event.preventDefault();

    const itemText = input.value;
    input.value = '';
    await postItem(itemText);
    renderItems();
}

async function renderItems() {
    const result = dropDownTemplate(await getItems());
    render(result, main);
}

async function getItems() {
    const res = await fetch(url);
    return Object.values(await res.json());
}

async function postItem(text) {
    try {
        if (text !== '') {
            await fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text})
            })
        } else {
            throw new Error('Item text cannot be empty string.')
        }
    } catch (error) {
        alert(error.message);
    }
}