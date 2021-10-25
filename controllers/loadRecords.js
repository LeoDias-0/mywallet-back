import connection from '../database/database.js'

const loadRecords = async (req, res) => {

    let token = req.headers.authorization
    if (!token) {
    	res.status(409)
    	return
    }
    token = token.replace('Bearer ', '')

    try {

        const sessions = await connection.query(`
            SELECT * FROM sessions WHERE token = $1;
        `, [token]).then(response => response.rows)

        if (!sessions[0]) {
            res.status(405).send('Usuário não logado!')
            return
        }

        const records = await connection.query(`
            SELECT * FROM records WHERE "userId" = $1;
        `, [sessions[0].id])

        console.log(records)
        res.status(200).send(records)
        return
        
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default loadRecords
