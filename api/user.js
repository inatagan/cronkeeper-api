const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

module.exports = app => {
    const { existsOrError, notExixstsOrError, equalsOrError } = app.api.validation
    
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = {...req.body}
        if(req.params.id) user.user_uuid = req.params.id

        try {
            existsOrError(user.name, 'Nome não definido')
            existsOrError(user.email, 'Email não definido')
            existsOrError(user.password, 'Senha não definido')
            existsOrError(user.confirmPassword, 'Confirmação de senha não definido')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não combinam')
            
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.user_uuid) {
                notExixstsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.user_uuid) {
            app.db('users')
                .update(user)
                .where({ user_uuid: user.user_uuid })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            //const userForDB = { user_uuid: uuidv4(), ...user }
            user.user_uuid = uuidv4()
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('user_uuid', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('user_uuid', 'name', 'email', 'admin')
            .where({ user_uuid: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}