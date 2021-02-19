const resetPassword = async (password, passwordConfirm, resetToken) => {
    try {
        await axios({
            method: 'PATCH',
            url: `http://localhost:4000/api/v1/users/resetPassword/${resetToken}`,
            data: {
                password,
                passwordConfirm
            }
        })
    } catch (err) {
        console.log(err)
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault()

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const url = window.location.href;
    const resetToken = url.match(/[^/]*$/)
    resetPassword(password, passwordConfirm, resetToken[0]);
    alert('Successfully Updated Password. Login with your new details.')
})