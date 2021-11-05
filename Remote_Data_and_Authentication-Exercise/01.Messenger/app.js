function attachEvents() {
    document.getElementById('submit').addEventListener('click', sendMessage);
    document.getElementById('refresh').addEventListener('click', refreshMessages);
    window.addEventListener('load', refreshMessages);
}

attachEvents();

const authorField = document.querySelector('[name="author"]');
const contentField = document.querySelector('[name="content"]');
const messagesField = document.getElementById('messages');

const url = 'http://localhost:3030/jsonstore/messenger';

async function sendMessage() {
    const author = authorField.value.trim();
    const content = contentField.value.trim();
    if (author == '' || content == '') return;

    const messageData = {
        author, 
        content
    };

    contentField.value = '';

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    };

    try {
        const res = await fetch(url, options);

        if (res.status != 200) {
            throw new Error(res.statusText);
        }
        await res.json();

        messagesField.textContent += `${author}: ${content}\n`;
    } catch (error) {
        alert(error.message);
    }
}

async function refreshMessages() {
    messagesField.textContent = 'Loading messages...';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(res.statusText);
        }
        const data = await res.json();

        messagesField.textContent = '';
        Object.values(data).forEach(message => {
            messagesField.textContent += `${message.author}: ${message.content}\n`
        })
    } catch (error) {
        alert(error.message);
    }
}