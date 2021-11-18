import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

const catsTemplate = (cats) => html`
<ul>
    ${cats.map(cat => html`
    <li>
        <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button class="showBtn" @click=${onToggle}>Show status code</button>
            <div class="status" style="display: none" id="${cat.id}">
                <h4>Status Code: ${cat.statusCode}</h4>
                <p>${cat.statusMessage}</p>
            </div>
        </div>
    </li>`)}
</ul>`

const main = document.getElementById('allCats');

renderCats();

function renderCats() {
    const result = catsTemplate(cats);
    render(result, main);
}

function onToggle(event) {
    const statusDiv = event.target.parentElement.querySelector('.status');
    
    if (statusDiv.style.display == 'none') {
        statusDiv.style.display = 'block';
        event.target.textContent = 'Hide status code'
    } else {
        statusDiv.style.display = 'none';
        event.target.textContent = 'Show status code'
    }
}