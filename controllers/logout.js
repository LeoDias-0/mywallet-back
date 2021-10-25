import connection from '../database/database.js'

const loadRecords = async (req, res) => {

    let token = req.headers.authorization
    if (!token) {
    	res.status(409)
    	return
    }
    token = token.replace('Bearer ', '')

    try {

        await connection.query(`
            DELETE * FROM sessions WHERE token = $1;
        `, [token])
        res.status(200)
        
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default loadRecords
