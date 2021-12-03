import { render } from './lib.js';
import { getUserData } from './util.js';
import { page } from './lib.js';
import { logout } from './api/data.js';
import { registerPage } from './views/register.js';
import { dashboardPage } from './views/dashboard.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { loginPage } from './views/login.js';
import { myBooksPage } from './views/mybooks.js';

const main = document.getElementById('site-content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/dashboard', dashboardPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/mybooks', myBooksPage);
page('/details/:id', detailsPage);
page('/', '/dashboard');

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
        document.querySelector('#user').style.display = 'block';
        document.querySelector('#guest').style.display = 'none';
        document.querySelector('#user span').textContent = `Welcome, ${userData.email}`;
    } else {
        document.querySelector('#user').style.display = 'none';
        document.querySelector('#guest').style.display = 'block';
    }
}

function onLogout() {
    logout();
    updateNav();
    page.redirect('/dashboard');
}