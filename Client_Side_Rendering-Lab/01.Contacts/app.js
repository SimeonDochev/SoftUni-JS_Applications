import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { styleMap } from '../../node_modules/lit-html/directives/style-map.js';
import { contacts } from './contacts.js';

const contactTemplate = (contactData, onDetails) => html`
<div class="contact card">
    <div>
        <i class="far fa-user-circle gravatar"></i>
    </div>
    <div class="info">
        <h2>Name: ${contactData.name}</h2>
        <button class="detailsBtn" @click=${() => onDetails(contactData)}>Details</button>
        <div class="details" id=${contactData.id} style=${styleMap({ display: contactData.details ? 'block' : 'none'})}>
            <p>Phone number: ${contactData.phoneNumber}</p>
            <p>Email: ${contactData.email}</p>
        </div>
    </div>
</div>`

start();

function start() {
    const container = document.getElementById('contacts');

    onRender();

    function onDetails(contact) {
        contact.details = !contact.details;
        onRender();
    }

    function onRender() {
        render(contacts.map(c => contactTemplate(c, onDetails)), container);
    }
}