import { showSection } from "./dom.js"

const section = document.getElementById('post-section');

const commentsUrl = `http://localhost:3030/jsonstore/collections/myboard/comments`;

export async function showPost(postId) {
    document.getElementById('main-div').innerHTML = '<p>Loading post...</p>';

    const [postData, postComments] = await Promise.all([
        getPostData(postId),
        getPostComments()
    ]);

    section.querySelector('span').textContent = postData.username;
    section.querySelector('time').textContent = postData.date;
    section.querySelector('.post-content').textContent = postData.content;
    section.querySelector('.theme-name').id = postId;

    console.log(postComments);
    if (postComments.length !== 0) {
        const post = document.getElementById('comments-section');

        postComments.forEach(c => {
            post.innerHTML += `
<div class="topic-name">
<p><strong>${c.author}</strong> commented on <time>${c.date}</time></p>
<div class="post-content">
<p>${c.content}</p>
</div>
</div>`;
        })
    }

    showSection(section);
}

const commentForm = document.querySelector('.answer form');
const postId = section.querySelector('.theme-name').id;
commentForm.addEventListener('submit', onPostComment);

async function onPostComment(event) {
    event.preventDefault();

    const commentUsername = document.getElementById('username').value.trim();
    const commentContent = document.getElementById('comment').value.trim();

    if (commentContent == '' || commentUsername == '') {
        alert('All fields are required!');
        return
    }

    try {
        const timeNow = new Date();
        const date = `${timeNow.getFullYear()}-${timeNow.getMonth()}-${timeNow.getDate()} ${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`

        const res = await fetch(commentsUrl, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: commentUsername,
                content: commentContent,
                date,
                postId
            })
        });
        if (res.ok != true) {
            const error = res.json();
            throw new Error(error)
        }
    } catch (error) {
        alert(error.message);
    }

    commentForm.reset();
}

async function getPostData(postId) {
    const res = await fetch(`http://localhost:3030/jsonstore/collections/myboard/posts/${postId}`);
    const data = await res.json();

    return data;
}

async function getPostComments() {
    console.log(postId);
    try {
        const res = await fetch(commentsUrl);
        if (res.status == 204) return {};
        if (res.ok != true) {
            const error = res.json();
            throw new Error(error.message);
        }
        const data = await res.json();
        return Object.values(data).filter(c => {
            c.postId == postId
        })
    } catch (error) {
        alert(error.message);
    }
}