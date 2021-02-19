const signUp = async (username, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/signup',
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
<<<<<<< HEAD
        console.log(err)
=======
>>>>>>> 7cc58a050b2e5849177c23b88f4b5e60ba9be6c7
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