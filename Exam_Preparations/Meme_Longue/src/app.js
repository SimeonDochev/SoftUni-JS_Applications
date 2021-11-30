import { render } from './lib.js';
import { getUserData } from './util.js';
import { page } from './lib.js';
import { logout } from './api/data.js';
import { loginPage } from './views/login.js';
import { homePage } from './views/home.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { profilePage } from './views/profile.js';

const main = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/memes', catalogPage);
page('/register', registerPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/profile', profilePage);
page('/details/:id', detailsPage);

updateNav();
page.start()

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.updateNav = updateNav;

    next();
}

async function updateNav() {
    const userData = getUserData();

    if (userData != undefined) {
        document.querySelector('.user').style.display = 'block';
        document.querySelector('.guest').style.display = 'none';
        document.querySelector('.user span').textContent = `Welcome, ${userData.email}`;
    } else {
        document.querySelector('.user').style.display = 'none';
        document.querySelector('.guest').style.display = 'block';
    }
}

function onLogout() {
    logout();
    updateNav();
    page.redirect('/');
}