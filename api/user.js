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
        if(req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, 'Nome não definido')
            existsOrError(user.email, 'Email não definido')
            existsOrError(user.password, 'Senha não definido')
            existsOrError(user.confirmPassword, 'Confirmação de senha não definido')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não combinam')
            
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExixstsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ user_uuid: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            const userForDB = { user_uuid: uuidv4(), ...user }
            app.db('users')
                .insert(userForDB)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('user_uuid', 'name', 'email', 'admin')
    }

    return { save }
}