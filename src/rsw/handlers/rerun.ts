import { Context } from 'probot'
import { Runs } from '../db-model'

export async function rerun(context: Context<'check_run.rerequested'>) {
  const id = context.payload.check_run.id
  if (!id) {
    return
  }

  const run = await Runs.findOne({ 'checks.checks_run_id': { $in: id } })

  if (!run) {
    return
  }

  const check = run.checks.find((check) => check.checks_run_id === id)
  if (!check) {
    return
  }

  await context.octokit.actions.reRunWorkflow({
    owner: run.repo.owner,
    repo: run.config.host_repo,
    run_id: check.run_id,
  })
}
