import * as mongoose from 'mongoose'

const expiry = 60 * 60 * 24 * 30 // 30 days

export interface ICheck {
  /** The run in the central workflow */
  run_id: number
  /** The name of the status check */
  name?: string
  /** The ID of status check */
  checks_run_id: number
}

export interface IRun extends mongoose.Document {
  sha: string
  ref: string
  event: string
  action: string
  callback: string
  checks: Array<ICheck>
  repo: {
    owner: string
    name: string
    full_name: string
  }
  config: {
    host_repo: string
  }
  expire_at?: Date
}

export const RunSchema = new mongoose.Schema({
  sha: String,
  ref: String,
  event: String,
  action: String,
  callback: String,
  checks: [
    {
      run_id: Number,
      name: String,
      checks_run_id: Number,
    },
  ],
  repo: {
    owner: String,
    name: String,
    full_name: String,
  },
  config: {
    host_repo: String,
  },
})

RunSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: expiry,
  },
)

export const MODEL_NAME = 'workflow-runs'

export const Runs = mongoose.model<IRun>(MODEL_NAME, RunSchema)
