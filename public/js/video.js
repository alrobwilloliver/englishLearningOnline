const video = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: window.location.origin + '/video',
        })

    } catch (err) {
        alert(err.response.data.message)
    }
}
