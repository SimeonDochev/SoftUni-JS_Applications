import { showView } from './dom.js';

const section = document.getElementById('edit-movie');
section.remove();

export function showEdit() {
    showView(section);
}

export async function editMovie(movieId, event) {
    const form = document.querySelector('form');

    const formData = new FormData(form);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imgUrl = formData.get('imageUrl').trim();

    try {
        const res = await fetch('http://localhost:3030/data/movies/' + movie._id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ title, description, imgUrl })
        })
        if (res.ok != true) {
            const error = res.json();
            throw new Error(error.message);
        }
        showDetails(movie._id);
    } catch (error) {
        alert(error.message);
    }
}