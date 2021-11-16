import { login } from '../api/data.js';

const section = document.getElementById('loginPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);

let context = null;

export async function showLoginPage(contextTarget) {
    context = contextTarget;
    context.showSection(section);
}

async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    await login(email, password);
    form.reset();
    context.goTo('home');
    context.updateNav();
}