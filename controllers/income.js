import connection from '../database/database.js'

const income = async (req, res) => {

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

        const { date, description, value, isIncome } = req.body
        await connection.query(`
            INSERT INTO records ( "userId", date, description, value, "isIncome") VALUES ($1, $2, $3, $4, $5);
        `, [sessions[0].id, date, description, value, isIncome])

        return res.sendStatus(200)

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default income
