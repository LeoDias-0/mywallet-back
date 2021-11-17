import express from 'express'
import cors from 'cors'
import login from './controllers/login.js'
import signIn from './controllers/signIn.js'
import loadRecords from './controllers/loadRecords.js'
import income from './controllers/income.js'
import outcome from './controllers/outcome.js'
import logout from './controllers/logout.js'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/login-in', login)

app.post('/sign-in', signIn)

app.get('/', loadRecords)

app.post('/new-income', income)

app.post('/new-outcome', outcome)

app.delete('/', logout)

export default app
