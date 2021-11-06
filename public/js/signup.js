const signUp = async (username, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: window.location.origin + '/api/v1/users/signup',
            data: {
                username,
                email,
                password,
                passwordConfirm
            }
        })

        if (res.data.status === 'success') {
            alert('You successfully signed up!')
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

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    signUp(username, email, password, passwordConfirm);
})
