import { html, render } from '../../node_modules/lit-html/lit-html.js';

//Fix the node modules path for every problem before testing.

const townsTemplate = (towns) => html`
<ul>
    ${towns.map(t => html`<li>${t}</li>`)}
</ul>`;

const main = document.getElementById('root');
const input = document.getElementById('towns');
document.querySelector('form').addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();

    const towns = input.value.split(',').map(t => t.trim());
    const result = townsTemplate(towns);

    render(result, main);
}