import { Probot } from 'probot'
import app from './app'

console.log(process.env)

Probot.run(app)
