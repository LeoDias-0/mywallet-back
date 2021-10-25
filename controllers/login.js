import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import connection from '../database/database.js'

const login = async (req, res) => {
    
    const { email, password } = req.body

    try {

        // TODO testar

        const users = await connection.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]).then(({ rows }) => rows)
        if (!users[0]) {
            res.status(409).send('Email não cadastrado!')
            return
        }

        const hashedPassword = users[0].password

        const isTheSamePassword = bcrypt.compareSync(password, hashedPassword)

        if (!isTheSamePassword) {
            res.status(409).send('Senha incorreta!')
            return
        }

        const token = uuid()
        await connection.query(`
            INSERT INTO sessions (token, id) VALUES ($1, $2);
        `, [token, users[0].id])

        res.status(200).send({
            name: users[0].name,
            token,
        })
        return
        
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default login