import pg from 'pg'

const { Pool } = pg

const credentials = {
    user: 'postgres',
    password: '2684159357',
    host: 'localhost',
    port: 5432,
    database: 'mywallet'
}

const connection = new Pool(credentials)

export default connection