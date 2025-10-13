import config from 'config'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import 'module-alias/register'
import mongoose from 'mongoose'
import passport from 'passport'
import { Server, Socket } from 'socket.io'
import swaggerUI from 'swagger-ui-express'

import { errorsCodes } from '@constants/common'
import Sentry from '@services/sentry'
import { AppSocket } from '@socket/types/socket'

import { socketAuthStrict } from '@middleware/socketAuthStrict'

import swDocument from './openapi'
import { createRoutes } from './routes'
import { onConnection } from './socket'

const app = express()
dotenv.config()
const PORT = config.get('port') || 5000

const transaction = Sentry.startTransaction({
  name: 'App.ts',
})

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

app.use(
  cors({
    origin: [config.get('clientPort')],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.use(fileUpload({}))
app.use(Sentry.Handlers.requestHandler())
app.use(express.json({ limit: '10mb' }))

app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  serveClient: false,
})

io.use(socketAuthStrict)

io.on('connection', async (socket: Socket) => {
  await onConnection(io, socket as AppSocket)
})

const routes = createRoutes(io)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument))
// обработка маршрутов
app.use('/api/v1', routes.authRouter)
app.use('/api/v1/files', routes.filesRouter)
app.use('/api/v1/notification', routes.notificationRouter)
app.use('/api/v1/role-rights', routes.roleRightsRouter)
app.use('/api/v1/users', routes.userRouter)
app.use('/api/v1/planned-events', routes.plannedEventsRouter)
app.use('/api/v1/system-events', routes.systemEventsRouter)
app.use('/api/v1/subject-area', routes.subjectAreaRouter)
app.use('/api/v1/skills-dictionary', routes.skillsDictionaryRouter)
app.use('/api/v1/workers', routes.workersRouter)

app.use('/api/v1/sessions', routes.sessionsRouter)
app.use('/api/v1/games', routes.gamesRouter)
app.use('/api/v1/departments-dictionary', routes.departmentsDictionary)

app.use('/api/v1/tasks', routes.tasksRouter)
app.use('/api/v1/work', routes.workRouter)
app.use('/api/v1/works-list', routes.worksListRouter)
app.use('/api/v1/network', routes.networkRouter)
app.use('/api/v1/risks', routes.risksRouter)

app.use('/api/v1/system-events-groups', routes.systemEventsGroupsRouter)
app.use('/api/v1/planned-events-groups', routes.plannedEventsGroupsRouter)
app.use('/api/v1/risks-groups', routes.risksGroupsRouter)
app.use('/api/v1/coach-sessions-groups', routes.coachSessionGroupsRouter)

app.use('/api/v1/teams', routes.teamsRouter)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found', code: errorsCodes.NOT_FOUND })
})

app.use(Sentry.Handlers.errorHandler())

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      autoIndex: true,
    })

    server.listen(PORT, () => {
      console.log(`Server started in ${PORT} port`)
    })
  } catch (error) {
    Sentry.captureException(error)
    console.log('Server Error', (error as Error).message)
    process.exit(1)
  } finally {
    transaction.finish()
  }
}

start()
