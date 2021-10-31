const login = async (username, password) => {
    // console.log(username, password)
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/login',
            data: {
                username,
                password
            }
        })

        if (res.data.status === 'success') {
            alert('You have successfully logged in!')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }

    } catch (err) {
        alert(err.response.data.message)
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    let username = document.getElementById('name').value;
    if (username) {
        username = username.trim()
    }
    const password = document.getElementById('password').value;
    // console.log(password);

    login(username, password)
})
