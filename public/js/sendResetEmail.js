const sendEmail = (email) => {
    try {
        await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/forgetPassword',
            data: email
        })
    } catch (err) {
        console.log(err)
    }
}

document.querySelector('.form').addEventListener(('submit'), e => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    sendEmail(email)
    alert('Email sent!')

})