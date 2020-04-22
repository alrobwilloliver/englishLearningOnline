const logout = async (req, res) => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4000/api/v1/users/logout'
        })
        if (res.data.status === 'success') {
            alert('You have successfully logged out.')
            location.reload(true);
        }
    } catch (err) {
        console.log(err)
        alert('Error logging out! Try again.')
    }
}

const logoutBtn = document.querySelector('.nav__el--logout')
if (logoutBtn) logoutBtn.addEventListener('click', logout)