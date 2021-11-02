async function lockedProfile() {
    const main = document.getElementById('main');
    const url = 'http://localhost:3030/jsonstore/advanced/profiles';

    try {
        main.innerHTML = '';
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error('Profiles not found');
        }

        const data = await res.json();

        let userCount = 1;
        for (let profile of Object.values(data)) {
            main.innerHTML += `<div class="profile">
            <img src="./iconProfile2.png" class="userIcon" />
            <label>Lock</label>
            <input type="radio" name="user${userCount}Locked" value="lock" checked>
            <label>Unlock</label>
            <input type="radio" name="user${userCount}Locked" value="unlock"><br>
            <hr>
            <label>Username</label>
            <input type="text" name="user${userCount}Username" value="${profile.username}" disabled readonly />
            <div id="user${userCount}HiddenFields">
            <hr>
            <label>Email:</label>
            <input type="email" name="user${userCount}Email" value="${profile.email}" disabled readonly />
            <label>Age:</label>
            <input type="email" name="user${userCount}Age" value="${profile.age}" disabled readonly />
            </div>
            <button>Show more</button>
            </div>`

            const hidden = document.getElementById(`user${userCount}HiddenFields`);
            hidden.style.display = 'none';
            userCount += 1;
        }
    } catch (error) {
        console.log(error.message);
    }

    const showMoreBtns = Array.from(document.querySelectorAll('button'));
    showMoreBtns.forEach(b => {
        b.addEventListener('click', showMore);
    })

    function showMore(e) {
        const button = e.target;
        const eventDiv = e.target.parentElement
        const unlocked = eventDiv.querySelectorAll('input')[1];
        const hiddenInfo = eventDiv.querySelector('div');

        if (unlocked.checked) {
            if (button.textContent == 'Show more') {
                hiddenInfo.style.display = 'block';
                button.textContent = 'Hide it';
            } else {
                hiddenInfo.style.display = 'none';
                button.textContent = 'Show more';
            }
        }
    }
}