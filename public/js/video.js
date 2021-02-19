const video = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4000/video',
        })

    } catch (err) {
        alert(err.response.data.message)
    }
}