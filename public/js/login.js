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
        console.log(res);
    } catch (err) {
        console.log(err.response.data)
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    // console.log(password);

    login(username, password)
})