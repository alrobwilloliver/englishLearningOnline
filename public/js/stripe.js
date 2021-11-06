var stripe = Stripe('pk_test_51HAOUmLILjZE998n6MxXIoJhGknhAxemcuDDW7VNBTzkYgUxHzwAI0wVnyMmZXZLK5PLHvM6aQm5guvSh6lLUCWv00cIiA5Urg');

const bookCourse = async courseId => {
    try {
        // 1) get the session from the server (api)
        const url = window.location.origin
        const session = await axios(url + `api/v1/bookings/checkout-session/${courseId}`)
        // 2) Create checkout form + charge credit card for us
        // console.log(session);

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        console.log(err)
        alert("error", err)
    }
}

document.getElementById('buy-course').addEventListener('click', e => {
    e.target.textContent = 'Processing...'
    // get the course id from the front end data set data-course-id [this is converted to camelcase automatically]
    const { courseId } = e.target.dataset;
    bookCourse(courseId);
})
