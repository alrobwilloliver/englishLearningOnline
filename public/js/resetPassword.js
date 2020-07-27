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
    const resetToken = docuemnt.querySelector('var').value;

    resetPassword(password, passwordConfirm, resetToken);
})