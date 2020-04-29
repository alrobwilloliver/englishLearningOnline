// type is either 'password' or 'data'
// const updateSettings = async (data, type) => {
//     try {
//         const url =
//             type === 'password'
//                 ? 'http://127.0.0.1:3000/api/v1/users/changePassword'
//                 : 'http://127.0.0.1:3000/api/v1/users/updateMe';

//         const res = await axios({
//             method: 'PATCH',
//             url,
//             data
//         });

//         if (res.data.status === 'success') {
//             alert(`${type.toUpperCase()} updated successfully!`);
//         }
//     } catch (err) {
//         alert(`Error: ${err.response.data.message}`);
//     }
// };

const updatePassword = async (currentPassword, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/users/changePassword',
            data: {
                currentPassword,
                password,
                passwordConfirm
            }
        })

        if (res.data.status === 'success') {
            alert('You have successfully updated user data!')
            window.setTimeout(() => {
                location.assign('/me')
            }, 1500)
        }


    } catch (err) {
        alert(`Password update failed! Error: ${err.response.data.message}`)
    }
}

const updateMe = async (username, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/users/updateMe',
            data: {
                username,
                email
            }
        })

        if (res.data.status === 'success') {
            alert('You have successfully updated user data!')
        }

    } catch (err) {
        console.log(err)
        alert(`Updating username and email failed. Error: ${err.response.data.message}`)
    }
}

document.querySelector('.form-user-settings').addEventListener('submit', async e => {
    e.preventDefault();

    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    console.log(currentPassword, password, passwordConfirm);

    await updatePassword(currentPassword, password, passwordConfirm);

    document.getElementById('password-current').value = ''
    document.getElementById('password').value = ''
    document.getElementById('password-confirm').value = ''
})

document.querySelector('.form-user-data').addEventListener('submit', e => {
    e.preventDefault();

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateMe(username, email);
})