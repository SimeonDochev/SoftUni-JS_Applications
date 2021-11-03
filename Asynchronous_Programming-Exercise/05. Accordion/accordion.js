window.addEventListener('load', solution);

async function solution() {
    const main = document.getElementById('main');
    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error('Not Found');
        }
        const data = await res.json();
        for (let article of data) {
            main.innerHTML += `
            <div class="accordion">
            <div class="head">
            <span>Scalable Vector Graphics</span>
            <button class="button" id="${article._id}">More</button>
            </div>
            <div class="extra">
            <p>Loading...</p>
            </div>`
        }
    } catch (error) {
        console.log(error.message);
    }

    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach(b => b.addEventListener('click', showMore));

    async function showMore(e) {
        const button = e.target;
        const currentDiv = button.parentElement.parentElement;
        const extra = currentDiv.querySelector('.extra');
        const para = currentDiv.querySelector('.extra p');

        if (button.textContent == 'More') {
            button.textContent = 'Less';
            extra.style.display = 'inline-block';
        } else {
            button.textContent = 'More';
            extra.style.display = 'none';
        }

        if (para.textContent === 'Loading...') {
            const url = `http://localhost:3030/jsonstore/advanced/articles/details/${button.id}`;
            try {
                const res = await fetch(url);
                if (res.status != 200) {
                    throw new Error('Article Not Found');
                }
                const data = await res.json();
                para.textContent = data.content;
            } catch(error) {
                para.textContent = 'Error';
            }
        }
    }
}