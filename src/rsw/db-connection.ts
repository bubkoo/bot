import mongoose from 'mongoose'
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from './constants'
import { log } from './util'

// Free DB: https://cloud.mongodb.com/

interface Status {
  connection: string
  state: string
}

let connection: 'down' | 'up' = 'down'

export function getDBStatus(): Status {
  return {
    connection,
    state: mongoose.STATES[mongoose.connection.readyState],
  }
}

export async function connectDB() {
  try {
    await mongoose.set('strictQuery', false).connect(DB_HOST, {
      user: DB_USER,
      pass: DB_PASS,
      dbName: DB_NAME,
      retryWrites: true,
      w: 'majority',
    })

    connection = 'up'
    log('DB connected')
  } catch (err) {
    connection = 'down'
    throw err
  }

  return getDBStatus
}
