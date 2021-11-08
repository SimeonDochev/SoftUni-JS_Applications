window.addEventListener('load', () => {
    document.getElementById('register').addEventListener('submit', onRegister);
});

async function onRegister(event) {
    event.preventDefault();

    const [emailInput, passwordInput, repeatPasswordInput] = document.querySelectorAll('input');
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password || !repeatPasswordInput.value) {
        alert('All fields are required!');
        return;
    } else if (password !== repeatPasswordInput.value) {
        alert('Passwords don\'t match!');
        return;
    }

    try {
        const res = await fetch('http:localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        if (res.ok == false) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();
        console.log(data);
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.location = './index.html';
    } catch (error) {
        alert(error.message);
    }
}