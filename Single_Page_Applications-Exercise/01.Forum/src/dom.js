const main = document.getElementById('main-div');

export function showSection(section) {
    main.replaceChildren(section);
}