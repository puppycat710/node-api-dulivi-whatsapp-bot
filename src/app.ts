import './config/env'
import express from 'express'
import cors from 'cors'

import routes from './routes/index'
import { corsOptions } from './config/cors'

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
// Rotas
app.use(routes)

export default app
