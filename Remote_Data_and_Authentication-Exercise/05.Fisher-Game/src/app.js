let userData = null;

window.addEventListener('load', () => {
    userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        document.getElementById('logout').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#addForm .add').disabled = false;
        document.querySelector('nav p span').textContent = userData.email;
    } else {
        document.getElementById('user').style.display = 'none';
    }

    document.querySelector('.load').addEventListener('click', loadData);
    document.getElementById('addForm').addEventListener('submit', onCreateSubmit);
    document.getElementById('logout').addEventListener('click', logoutUser);
});

async function onCreateSubmit(event) {
    event.preventDefault();
    if (!userData) {
        window.location = './login.html';
        return;
    }

    const formData = new FormData(event.target);

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, {[k]: v}), {});

    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required!');
        }
        const res = await fetch('http://localhost:3030/data/catches', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(data)
        });
        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        event.target.reset();
        loadData();
    } catch (error) {
        alert(error.message);
    }
}

async function loadData() {
    const catchesDiv = document.getElementById('catches');
    catchesDiv.textContent = 'Loading catches...';
    const res = await fetch('http://localhost:3030/data/catches');
    const data = await res.json();

    catchesDiv.replaceChildren(...data.map(createPreview));
}

function createPreview(item) {
    const isOwner = (userData && item._ownerId == userData.id);

    const element = document.createElement('div');
    element.className = 'catch';
    element.innerHTML = `<label>Angler</label>
<input type="text" class="angler" value="${item.angler}" ${!isOwner ? 'disabled' : ''}>
<label>Weight</label>
<input type="text" class="weight" value="${item.weight}" ${!isOwner ? 'disabled' : ''}>
<label>Species</label>
<input type="text" class="species" value="${item.species}" ${!isOwner ? 'disabled' : ''}>
<label>Location</label>
<input type="text" class="location" value="${item.location}" ${!isOwner ? 'disabled' : ''}>
<label>Bait</label>
<input type="text" class="bait" value="${item.bait}" ${!isOwner ? 'disabled' : ''}>
<label>Capture Time</label>
<input type="number" class="captureTime" value="${item.captureTime}" ${!isOwner ? 'disabled' : ''}>
<button class="update" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
<button class="delete" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>`;
    element.querySelector('.update').addEventListener('click', updateCatch);
    element.querySelector('.delete').addEventListener('click', deleteCatch);

    return element;
}

async function updateCatch(event) {
    const catchDiv = event.target.parentElement;
    const catchId = event.target.getAttribute('data-id');
    const newData = {}
    catchDiv.querySelectorAll('input').forEach(d => {
        newData[d.className] = d.value;
    });

    await fetch('http://localhost:3030/data/catches/' + catchId, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': userData.token
        },
        body: JSON.stringify(newData)
    });
    alert('Catch information was successfully updated!');
}

async function deleteCatch(event) {
    const catchDiv = event.target.parentElement;
    const catchId = event.target.getAttribute('data-id');

    document.getElementById('catches').textContent = 'Deleting catch...';
    
    await fetch('http://localhost:3030/data/catches/' + catchId, {
        method: 'delete',
        headers: {
            'X-Authorization': userData.token
        },
    });
    loadData();
}

async function logoutUser() {
    await fetch('http:localhost3030/users/logout');
    sessionStorage.clear();
    window.location = './index.html';
}