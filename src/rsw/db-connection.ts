import mongoose from 'mongoose'
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from './constants'

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
    await mongoose.connect(DB_HOST, {
      user: DB_USER,
      pass: DB_PASS,
      dbName: DB_NAME,
      retryWrites: true,
      w: 'majority',
    })

    connection = 'up'
    // eslint-disable-next-line no-console
    console.log('DB connected')
  } catch (err) {
    connection = 'down'
    throw err
  }

  return getDBStatus
}
