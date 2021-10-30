function loadCommits() {
    const username = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;
    const list = document.getElementById('commits');

    const url = `https://api.github.com/repos/${username}/${repo}/commits`;

    fetch(url)
        .then(response => {
            if (response.ok == false) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        })
        .then(handleResponse)
        .catch(handleError);
    
    function handleResponse(data) {
        list.innerHTML = '';

        for (let commit of data) {
            const liElement = document.createElement('li');
            liElement.textContent = `${commit.commit.author.name}: ${commit.commit.message}`;
            list.appendChild(liElement);
        }
    }

    function handleError(error) {
        list.innerHTML = '';
        list.textContent = `Error: ${error.message} (Not Found)`;
    }
}