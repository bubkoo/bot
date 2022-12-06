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
  callback_url: string
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
  callback_url: String,
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

// Update existing document with config.host_repo field
Runs.updateOne(
  { 'config.host_repo': { $exists: false } },
  { $set: { config: { host_repo: '.github' } } },
  { new: true, multi: true },
  (err, numberAffected) => {
    if (err) {
      return console.error(err)
    }
    if (numberAffected?.ok) {
      // eslint-disable-next-line no-console
      console.log('updated', numberAffected.nModified, 'rows')
    }
  },
)
