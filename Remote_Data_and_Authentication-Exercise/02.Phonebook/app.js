function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', createContact);
}

attachEvents();

const contactsList = document.getElementById('phonebook');
const personInput = document.getElementById('person');
const phoneInput = document.getElementById('phone');

async function loadContacts() {
    const url = 'http://localhost:3030/jsonstore/phonebook';

    contactsList.replaceChildren();
    contactsList.textContent = 'Loading contacts...';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        contactsList.textContent = '';
        Object.values(data).forEach(contact => {
            const liElement = document.createElement('li');
            liElement.innerHTML = `${contact.person}: ${contact.phone}<button>Delete</button>`;
            liElement.querySelector('button').addEventListener('click', deleteContact.bind(null, contact._id));
            contactsList.appendChild(liElement);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function deleteContact(key) {
    const url = `http://localhost:3030/jsonstore/phonebook/${key}`;
    contactsList.textContent = 'Deleting contact...';
    
    const options = {
        method: 'delete',
        headers: {},
        body: {}
    };

    try {
        const res = await fetch(url, options);
        if (res.ok === false) {
            throw new Error(res.statusText);
        }
        await res.json();
        loadContacts();
    } catch (error) {
        alert(error.message);
    }
}

async function createContact() {
    const url = 'http://localhost:3030/jsonstore/phonebook';

    const person = personInput.value.trim();
    const phone = phoneInput.value.trim();
    personInput.value = '';
    phoneInput.value = '';
    contactsList.textContent = 'Creating contact...';

    if (person == '' || phone == '') return;

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({person, phone})
    };

    try {
        const res = await fetch(url, options);
        if (res.ok === false) {
            throw new Error(res.statusText);
        }
        await res.json();
        loadContacts();
    } catch (error) {
        alert(error.message);
    }
}