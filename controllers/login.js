import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import connection from '../database/database.js'
import validateLogin from '../validations/validateLogin.js'

const login = async (req, res) => {
    
    const { email, password } = req.body

    try {

        const loginIsNotValid = validateLogin.validate(req.body).error
        if (loginIsNotValid) return res.status(422).send('Dados inválidos.')

        const users = await connection.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]).then(({ rows }) => rows)
        if (!users[0]) {
            return res.status(409).send('Email não cadastrado!')
        }

        const hashedPassword = users[0].password

        const isTheSamePassword = bcrypt.compareSync(password, hashedPassword)

        if (!isTheSamePassword) {
            return res.status(409).send('Senha incorreta!')
        }

        const token = uuid()
        await connection.query(`
            INSERT INTO sessions (token, id) VALUES ($1, $2);
        `, [token, users[0].id])

        return res.status(200).send({
            name: users[0].name,
            token,
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500)
    }
}

export default login