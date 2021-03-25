const { v4: uuidv4 } = require('uuid')

module.exports = app => {
    const { existsOrError, notExixstsOrError, equalsOrError } = app.api.validation

    const save = (req, res) => {
        const event = { ...req.body }
        if(req.params.id) event.event_uuid = req.params.id

        try {
            existsOrError(event.name, 'Nome do evento não definido')
            existsOrError(event.datetime, 'Data do evento não definido')
        } catch (msg) {
            res.status(400).send(msg)
        }

        if(event.event_uuid) {
            app.db('events')
                .update(event)
                .where({ event_uuid: event.event_uuid })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            event.event_uuid = uuidv4()
            app.db('events')
                .insert(event)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('events')
                .where({ event_uuid: req.params.id }).del()
            try {
                existsOrError(rowsDeleted, 'Evento não encontrado')
            } catch (msg) {
                return res.status(400).send(msg)
            }
            
            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('events').count('event_uuid').first()
        const count = parseInt(result.count)

        app.db('events')
            .select('event_uuid', 'name', 'datetime')
            .limit(limit).offset(page * limit - limit)
            .then(events => res.json({ data: events, count, limit }))
            .catch(err => res.status(500).send(err))
    }
    
    const getById = (req, res) => {
        app.db('events')
            .where({ event_uuid: req.params.id })
            .first()
            .then(event => res.json(event))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}