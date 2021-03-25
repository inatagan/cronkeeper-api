module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/events')
        .get(app.api.event.get)
        .post(app.api.event.save)
    
    app.route('/events/:id')
        .get(app.api.event.getById)
        .put(app.api.event.save)
        .delete(app.api.event.remove)
}