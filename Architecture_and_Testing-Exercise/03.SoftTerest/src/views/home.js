const section = document.getElementById('homePage');
section.remove();
section.querySelector('#getStartedLink').addEventListener('click', (event) => {
    event.preventDefault();
    context.goTo('catalog');
});

let context = null;

export async function showHomePage(contextTarget) {
    context = contextTarget;
    context.showSection(section);
}
