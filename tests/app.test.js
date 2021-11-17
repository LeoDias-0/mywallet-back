import app from '../index.js'
import supertest from 'supertest'
import connection from '../database/database.js'
import faker from 'faker'
import bcrypt from 'bcrypt'


beforeEach(async () => {
    await connection.query(`DELETE FROM sessions;`)
    await connection.query(`DELETE FROM users;`)
})

afterAll(() => {
    connection.end()
})

describe('POST /login-in', () => {
    it('returns 409 for unregistered email', async () => {
        const body = {
            email: faker.internet.email(),
            password: 'senhadifícil123'
        }

        const result = await supertest(app).post('/login-in').send(body)
        const status = result.status
        
        expect(status).toEqual(409)
    })

    it('returns 422 for invalid email', async () => {
        const body = {
            email: 'asmdlasm',
            password: 'senhadifícil123'
        }

        const result = await supertest(app).post('/login-in').send(body)
        const status = result.status
        
        expect(status).toEqual(422)
    })

    it('returns 422 for invalid info', async () => {
        const body = {
            email: faker.internet.email(),
            password: ''
        }

        const result = await supertest(app).post('/login-in').send(body)
        const status = result.status
        
        expect(status).toEqual(422)
    })

    it('returns 409 for incorrect password', async () => {
        const fakerName = faker.name.findName()
        const fakerEmail = faker.internet.email()
        const fakerHashedPassword = faker.internet.password(20)

        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [fakerName, fakerEmail, fakerHashedPassword])

        const body = {
            email: fakerEmail,
            password: faker.internet.password(6)
        }

        const result = await supertest(app).post('/login-in').send(body)
        const status = result.status
        
        expect(status).toEqual(409)
    })

    it('returns 200 for creation of session succeed', async () => {
        const fakerName = faker.name.findName()
        const fakerEmail = faker.internet.email()
        const fakerPassword = faker.internet.password(6)
        const fakerHashedPassword = bcrypt.hashSync(fakerPassword, 10)

        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [fakerName, fakerEmail, fakerHashedPassword])

        const body = {
            email: fakerEmail,
            password: fakerPassword
        }

        const result = await supertest(app).post('/login-in').send(body)
        const status = result.status
        
        expect(status).toEqual(200)
        
        const userId = await connection.query(`
            SELECT id FROM users WHERE email=$1;
        `, [fakerEmail]).then(response => response.rows[0].id)

        const token = await connection.query(`
            SELECT token FROM sessions WHERE id=$1;
        `, [userId]).then(response => response.rows[0].token)

        expect(result.body).toMatchObject({token})
    })
})