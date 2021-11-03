window.addEventListener('load', attachEvents);

function attachEvents() {
    document.getElementById('btnLoadPosts').addEventListener('click', getAllPosts);
    document.getElementById('btnViewPost').addEventListener('click', displayPost);

    async function displayPost() {
        const titleElement = document.getElementById('post-title');
        const bodyElement = document.getElementById('post-body');
        const ulElement = document.getElementById('post-comments');
    
        titleElement.textContent = 'Loading...';
        bodyElement.textContent = '';
        ulElement.replaceChildren();
    
        const selectedId = document.getElementById('posts').value;
        
        const [post, comments] = await Promise.all([
            getPostById(selectedId),
            getCommentsById(selectedId)
        ]);
    
        titleElement.textContent = post.title;
        bodyElement.textContent = post.body;
    
        comments.forEach(c => {
            const liElement = document.createElement('li');
            liElement.textContent = c.text;
            ulElement.appendChild(liElement);
        });
    }
    
    async function getAllPosts() {
        const selectedElement = document.getElementById('posts');
        const url = 'http://localhost:3030/jsonstore/blog/posts';
    
        try {
            const res = await fetch(url);
            if (res.status != 200) {
                throw new Error('Posts Not Found');
            }
            const data = await res.json();
            selectedElement.replaceChildren();
    
            Object.values(data).forEach(p => {
                const optionElement = document.createElement('option');
                optionElement.textContent = p.title;
                optionElement.value = p.id;
    
                selectedElement.appendChild(optionElement);
            });
        } catch(error) {
            console.log(error.message);
        }
    }
    
    async function getPostById(postId) {
        const url = `http://localhost:3030/jsonstore/blog/posts/${postId}`;
    
        const res = await fetch(url);
        const data = await res.json();
    
        return data;
    }
    
    async function getCommentsById(postId) {
        const url = 'http://localhost:3030/jsonstore/blog/comments';
    
        const res = await fetch(url);
        const data = await res.json();
    
        const comments = Object.values(data).filter(c => c.postId == postId);
    
        return comments;
    }
}