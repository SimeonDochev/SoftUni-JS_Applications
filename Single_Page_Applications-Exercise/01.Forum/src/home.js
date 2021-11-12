import { showSection } from "./dom.js"
import { showPost } from "./post.js"

const form = document.querySelector('form');
const postsContainer = document.querySelector('.topic-title');
const homePage = document.querySelector('.container');

document.querySelector('nav li').addEventListener('click', showHome);
postsContainer.addEventListener('click', openPost);
form.addEventListener('submit', onPost);
document.querySelector('.cancel').addEventListener('click', onCancel);

const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';

showHome();

function showHome() {
    showSection(homePage);
    loadPosts();
}

async function loadPosts() {
    postsContainer.textContent = 'Loading posts...';

    const res = await fetch(url);
    const data = await res.json();
    
    postsContainer.textContent = '';

    Object.values(data).forEach(postData => {
        createPost(postData);
    })
}

async function onPost(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const title = formData.get('topicName').trim();
    const username = formData.get('username').trim();
    const content = formData.get('postText').trim();
    const timeNow = new Date();
    const date = `${timeNow.getFullYear()}-${timeNow.getMonth()}-${timeNow.getDate()} ${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`

    form.reset();

    if (title == '' || username == '' || content == '') {
        alert('All fields are required!');
        return;
    }

    const res = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, username, content, date })
    });

    const data = await res.json();
    
    createPost(data);
}

function onCancel(event) {
    event.preventDefault();

    event.target.parentElement.parentElement.reset();
}

async function openPost(event) {
    if (event.target.tagName == 'H2') {
        const postId = event.target.parentElement.id;
        showPost(postId);
    }
}

function createPost(postData) {
    postsContainer.innerHTML += `
<div class="topic-container">
<div class="topic-name-wrapper">
<div class="topic-name">
<a href="javascript:void(0)" id="${postData._id}" class="normal">
<h2>${postData.title}</h2>
</a>
<div class="columns">
<div>
<p>Date: <time>${postData.date}</time></p>
<div class="nick-name">
<p>Username: <span>${postData.username}</span></p>
</div>
</div>
</div>
</div>
</div>
</div>`;
}
