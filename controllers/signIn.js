import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import connection from '../database/database.js'

const signIn = async (req, res) => {
    
    const { name, email, password } = req.body

    try {
        console.log(req.body)

        // TODO testar
        // validar se são dados válidos

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
