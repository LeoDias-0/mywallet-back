import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import connection from '../database/database.js'
import validateSign from '../validations/validateSign.js'

const signIn = async (req, res) => {
    
    const { name, email, password } = req.body

    try {

        const signInIsNotValid = validateSign.validate(req.body).error
        if (signInIsNotValid) return res.status(422).send('Dados inválidos.')

        const users = await connection.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]).then(response => response.rows)

        if (users[0]) {
            res.status(409).send('Email já cadastrado!')
            return
        }

        const hashedPassword = bcrypt.hashSync(password, 10)
        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [name, email, hashedPassword])

        res.status(200).send('Usuário cadastrado com sucesso!')
        return
        
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default signIn
