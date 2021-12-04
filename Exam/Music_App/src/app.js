import { render } from './lib.js';
import { getUserData } from './util.js';
import { page } from './lib.js';
import { logout } from './api/data.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';

const main = document.getElementById('main-content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

const userNav = Array.from(document.querySelectorAll('.user'));
const guestNav = Array.from(document.querySelectorAll('.guest'));

page(decorateContext);
page('/home', homePage);
page('/login', loginPage);
page('/catalog', catalogPage);
page('/register', registerPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/details/:id', detailsPage);
page('/', '/home');

updateNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.updateNav = updateNav;

    next();
}

async function updateNav() {
    const userData = getUserData();

    if (userData != undefined) {
        userNav.forEach(e => e.style.display = 'inline');
        guestNav.forEach(e => e.style.display = 'none');
    } else {
        userNav.forEach(e => e.style.display = 'none');
        guestNav.forEach(e => e.style.display = 'inline');
    }
}

function onLogout() {
    logout();
    updateNav();
    page.redirect('/home');
}